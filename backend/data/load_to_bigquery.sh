#!/bin/bash
# AROGYA-DI — BigQuery data load script
# Loads the 3 structured datasets into the arogya_data dataset.

PROJECT_ID="ameer-491011"
DATASET="arogya_data"

bq mk --location=us-central1 --dataset ${PROJECT_ID}:${DATASET}

bq load --autodetect --source_format=CSV --skip_leading_rows=1 \
  --column_name_character_map=V2 \
  ${DATASET}.air_quality ./city_day.csv

bq load --autodetect --source_format=CSV --skip_leading_rows=1 \
  ${DATASET}.hospital_readmissions ./admissions.csv

bq load --autodetect --source_format=CSV --skip_leading_rows=1 \
  --column_name_character_map=V2 \
  ${DATASET}.zika_outbreaks ./RS_Session_265_AU_897_A_i.csv

echo "All datasets loaded into ${DATASET}."