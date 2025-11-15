import * as fs from "fs";

export class CSVHelper {

  static export(filePath: string, rows: any[]) {
    if (!rows.length) return;

    const headers = Object.keys(rows[0]).join(",");
    const body = rows.map(r =>
      Object.values(r)
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );

    const csv = [headers, ...body].join("\n");

    fs.writeFileSync(filePath, csv, "utf-8");
    console.log(`CSV saved → ${filePath}`);
  }

  static read(filePath: string) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n").filter(Boolean);

    const headers = lines[0].split(",");

    const rows = lines.slice(1).map(line => {
      const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
      const clean = values.map(v => v.replace(/^"|"$/g, ""));
      const obj: any = {};
      headers.forEach((h, i) => (obj[h] = clean[i]));
      return obj;
    });

    return { headers, rows };
  }
}
