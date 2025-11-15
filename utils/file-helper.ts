// utils/file-helper.ts
import path from "path";
import fs from "fs";
import dayjs from "dayjs";

export class FileHelper {

  /** Ensure folder exists (download or user-defined) */
  static ensureFolder(folderPath: string): string {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created folder: ${folderPath}`);
    }
    return folderPath;
  }

  /** Build short timestamp: MMDD_HHmm */
  static shortTimestamp(): string {
    return dayjs().format("MMDD_HHmm");
  }

  /** Build timestamped filename: base_MMDD_HHmm.csv */
  static timestampedFilename(baseName: string): string {
    return `${baseName}_${this.shortTimestamp()}.csv`;
  }

  /** Merge folder + filename → full file path */
  static buildPath(folder: string, fileName: string): string {
    return path.join(folder, fileName);
  }

  /** Full flexible pipeline in ONE method */
  static buildCSVPath(baseName: string, folderPath = "download"): string {
    const folder = this.ensureFolder(folderPath);
    const fileName = this.timestampedFilename(baseName);
    return this.buildPath(folder, fileName);
  }
}
