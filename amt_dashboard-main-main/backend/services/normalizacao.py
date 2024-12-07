import pandas as pd
import re

def normalize_dataframe(df):
    column_mappings = {
        'tipo_residuo': ['TIPO DE RESÍDUO', 'Tipo Residuo', 'resíduo', 'Tipo', 'Resíduo', 'Tipo de resíduo - Toneladas'],
        'total': ['TOTAL', 'total', 'Total', 'TOTAL 2018']
    }

    meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    meses_abreviados = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

    for standard_name, possible_names in column_mappings.items():
        for name in possible_names:
            if name in df.columns:
                df.rename(columns={name: standard_name}, inplace=True)
                break

    for mes, mes_abreviado in zip(meses, meses_abreviados):
        for col in df.columns:
            if re.match(fr'^{mes_abreviado}/\d{{2}}$', col) or re.match(fr'^{mes}/\d{{2}}$', col):
                df.rename(columns={col: mes}, inplace=True)

    for col in df.columns:
        if col in meses or col == 'total':
            df[col] = df[col].fillna(0) 

    for col in df.columns:
        if col in meses or col == 'total':
            df[col] = pd.to_numeric(df[col].astype(str).str.replace(',', '.'), errors='coerce').fillna(0)

    return df

