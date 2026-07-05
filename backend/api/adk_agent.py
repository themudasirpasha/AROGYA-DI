from google.adk.agents import Agent
import sys
from alerts.pubsub_subscriber import pull_alerts
from multimodal.speech_to_text import transcribe_audio
from multimodal.live_air_quality import get_live_air_quality
sys.path.append('/home/thepashas786/arogya-di-backend')
from whatif_simulator.simulator_logic import simulate_intervention
from google.cloud import geminidataanalytics, pubsub_v1
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import json

PROJECT_ID = "ameer-491011"
LOCATION = "global"
DATA_AGENT_ID = "agent_dad9f98c-a15e-44ad-8aff-512f606048b8"


def query_health_data(question: str) -> str:
    """Answers natural language questions about health data using BigQuery."""
    data_chat_client = geminidataanalytics.DataChatServiceClient()
    messages = [geminidataanalytics.Message(
        user_message=geminidataanalytics.UserMessage(text=question)
    )]
    data_agent_context = geminidataanalytics.DataAgentContext(
        data_agent=f"projects/{PROJECT_ID}/locations/{LOCATION}/dataAgents/{DATA_AGENT_ID}"
    )
    request = geminidataanalytics.ChatRequest(
        parent=f"projects/{PROJECT_ID}/locations/{LOCATION}",
        messages=messages,
        data_agent_context=data_agent_context,
    )
    texts = []
    for response in data_chat_client.chat(request=request):
        msg = response.system_message
        if msg.text and msg.text.parts:
            texts.append(" ".join(msg.text.parts))
        if msg.data and msg.data.result:
            texts.append(f"[DATA TABLE]: {str(msg.data.result)}")
        if msg.chart and msg.chart.result:
            texts.append(f"[CHART SPEC]: {str(msg.chart.result)}")
    return " ".join(texts) if texts else "No response generated."

def analyze_field_image(image_bytes: bytes, mime_type: str) -> str:
    """Analyzes a field-uploaded photo to detect potential mosquito/dengue breeding sites."""
    vertexai.init(project=PROJECT_ID, location="us-central1")
    model = GenerativeModel("gemini-2.5-flash")
    prompt = """Analyze this image for a potential mosquito/dengue breeding 
    site (stagnant water, uncovered containers, waste). Respond ONLY in JSON:
    {"breeding_site_detected": true/false, "confidence": 0-100, 
     "reason": "...", "recommended_action": "..."}"""
    image_part = Part.from_data(data=image_bytes, mime_type=mime_type)
    response = model.generate_content([prompt, image_part])
    return response.text


def publish_health_alert(alert_type: str, message: str, severity: str = "high") -> str:
    """Publishes a proactive health alert (e.g. disease anomaly) to the alerting system."""
    publisher = pubsub_v1.PublisherClient()
    topic_path = publisher.topic_path(PROJECT_ID, "arogya-alerts")
    data = json.dumps({"type": alert_type, "message": message, "severity": severity}).encode("utf-8")
    future = publisher.publish(topic_path, data)
    return f"Alert published, id: {future.result()}"

def check_pending_alerts() -> str:
    """Checks for pending proactive health alerts (anomalies, outbreaks) that need attention."""
    alerts = pull_alerts()
    if not alerts:
        return "No pending alerts at this time."
    result = []
    for alert in alerts:
        result.append(f"[{alert['severity'].upper()}] {alert['type']}: {alert['message']}")
    return "\n".join(result)


def transcribe_citizen_call(audio_bytes: bytes) -> str:
    """Transcribes a citizen helpline call or voice report into text for analysis."""
    return transcribe_audio(audio_bytes)


def check_live_air_quality(city_name: str, latitude: float, longitude: float) -> str:
    """Fetches real-time (live) air quality for a city, using its coordinates. Use this for 'right now' or 'current' air quality questions, as opposed to historical averages."""
    result = get_live_air_quality(latitude, longitude)
    if "error" in result:
        return f"Could not fetch live air quality: {result['error']}"
    aqi_info = result.get("indexes", [{}])[0]
    return (f"Live air quality in {city_name}: Universal AQI = {aqi_info.get('aqi')}, "
            f"Category: {aqi_info.get('category')}, "
            f"Dominant pollutant: {aqi_info.get('dominantPollutant')}")


root_agent = Agent(
    name="arogya_di_orchestrator",
    model="gemini-2.5-flash",
    description="AROGYA-DI health decision intelligence orchestrator",
    instruction="""You are AROGYA-DI, a health decision intelligence assistant 
    for district health officers. Use query_health_data for questions about 
    patients, disease surveillance, readmissions, historical air quality 
    trends, and FORECASTS (any question with "forecast", "predict", "next 
    7 days", or "next week" about air quality or disease trends must use 
    query_health_data, never check_live_air_quality). Use 
    publish_health_alert when an anomaly needs escalation. Use 
    simulate_intervention when the user asks "what if" questions about 
    public health interventions such as earlier screening, extra hospital 
    beds, or increased vector control. Use check_pending_alerts when the 
    user asks if there are any active or pending health alerts. Use 
    check_live_air_quality ONLY when the user explicitly asks about 
    "current", "right now", or "today's" air quality — never for 
    forecasts or historical trends. ALWAYS first call query_health_data 
    to look up the city's latitude/longitude from the city_coordinates 
    table before calling check_live_air_quality. Always respond in the 
    same language the user's question was asked in (English, Hindi, or 
    Kannada). Always ground answers in tool results - never guess.""",
    tools=[query_health_data, publish_health_alert, simulate_intervention, check_pending_alerts, check_live_air_quality],
)
