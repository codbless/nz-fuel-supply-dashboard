import type { MbieWeeklyRow } from "./types";

type NationalRetailSnapshot = {
  effectiveAt: string;
  status: string;
  regularCpl: number;
  premiumCpl: number;
  dieselCpl: number;
  week: string;
};

function parseCsvLine(line: string) {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  fields.push(current);
  return fields;
}

export function parseMbieWeeklyCsv(rawText: string) {
  const lines = rawText
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    throw new Error("Pump Watch source CSV was empty.");
  }

  const [, ...dataLines] = lines;

  return dataLines
    .map((line) => {
      const [week, date, fuel, variable, value, unit, status] = parseCsvLine(line);

      return {
        week,
        date,
        fuel,
        variable,
        value: Number(value),
        unit,
        status,
      } satisfies MbieWeeklyRow;
    })
    .filter((row) => Number.isFinite(row.value));
}

export function extractLatestNationalRetailSnapshot(rows: MbieWeeklyRow[]) {
  const relevantRows = rows.filter(
    (row) =>
      row.variable === "Adjusted retail price" &&
      (row.fuel === "Regular Petrol" ||
        row.fuel === "Premium Petrol 95R" ||
        row.fuel === "Diesel"),
  );

  if (relevantRows.length === 0) {
    throw new Error("No MBIE retail price rows were found in the source CSV.");
  }

  const latestDate = relevantRows.reduce(
    (latest, row) => (row.date > latest ? row.date : latest),
    relevantRows[0]?.date ?? "",
  );
  const latestRows = relevantRows.filter((row) => row.date === latestDate);

  const regular = latestRows.find((row) => row.fuel === "Regular Petrol");
  const premium = latestRows.find((row) => row.fuel === "Premium Petrol 95R");
  const diesel = latestRows.find((row) => row.fuel === "Diesel");

  if (!regular || !premium || !diesel) {
    throw new Error("Latest MBIE row set is missing one or more fuel grades.");
  }

  return {
    effectiveAt: latestDate,
    status: regular.status,
    regularCpl: regular.value,
    premiumCpl: premium.value,
    dieselCpl: diesel.value,
    week: regular.week,
  } satisfies NationalRetailSnapshot;
}
