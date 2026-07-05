"""
Simplified What-If Simulator for AROGYA-DI.
Given a baseline case count and an intervention scenario, 
recalculates projected impact using a lightweight heuristic model.
"""

def simulate_intervention(
    baseline_cases: int,
    intervention_type: str,
    intervention_strength: int
) -> dict:
    """
    Simulates the effect of a public health intervention on case counts.

    intervention_type: one of "earlier_screening", "extra_beds", "vector_control"
    intervention_strength: a number representing intensity 
        - for earlier_screening: days earlier (e.g. 2)
        - for extra_beds: number of extra beds (e.g. 15)
        - for vector_control: % increase in fogging/spraying coverage (e.g. 30)
    """

    reduction_factor = 0.0
    explanation = ""

    if intervention_type == "earlier_screening":
        reduction_factor = min(intervention_strength * 0.08, 0.45)
        explanation = f"Screening {intervention_strength} day(s) earlier typically reduces peak spread by isolating cases sooner."

    elif intervention_type == "extra_beds":
        reduction_factor = min(intervention_strength * 0.01, 0.35)
        explanation = f"Adding {intervention_strength} extra beds reduces bottleneck-driven complications and improves care capacity."

    elif intervention_type == "vector_control":
        reduction_factor = min(intervention_strength * 0.006, 0.40)
        explanation = f"Increasing vector control coverage by {intervention_strength}% reduces new transmission opportunities."

    else:
        return {
            "error": "Unknown intervention_type. Use 'earlier_screening', 'extra_beds', or 'vector_control'."
        }

    projected_cases = round(baseline_cases * (1 - reduction_factor))
    cases_averted = baseline_cases - projected_cases

    return {
        "baseline_cases": baseline_cases,
        "intervention_type": intervention_type,
        "intervention_strength": intervention_strength,
        "projected_cases": projected_cases,
        "cases_averted": cases_averted,
        "reduction_percent": round(reduction_factor * 100, 1),
        "explanation": explanation
    }


if __name__ == "__main__":
    result = simulate_intervention(34, "earlier_screening", 2)
    print(result)