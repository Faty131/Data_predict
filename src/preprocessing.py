import pandas as pd

def load_data(path):
    return pd.read_csv(path, parse_dates=[
        "EventStartTime", "EventEndTime"
    ])

def clean_data(df):
    df = df.copy()

    # Supprimer les lignes sans durée
    df = df.dropna(subset=["EventDuration(min)"])

    # Renommer colonne cible
    df.rename(columns={
        "EventDuration(min)": "delay_minutes"
    }, inplace=True)

    # Valeurs négatives interdites
    df = df[df["delay_minutes"] >= 0]

    # Extraire infos temporelles
    df["hour"] = df["EventStartTime"].dt.hour
    df["dayofweek"] = df["EventStartTime"].dt.dayofweek
    df["month"] = df["EventStartTime"].dt.month

    # Heure de pointe
    df["heure_pointe"] = df["hour"].isin([7, 8, 9, 16, 17, 18, 19]).astype(int)

    # Incident majeur
    df["incident_majeur"] = df["Status"].isin(
        ["Disruption", "Works"]
    ).astype(int)

    return df

def save_clean_data(df, path):
    df.to_csv(path, index=False)
