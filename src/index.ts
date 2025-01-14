import {
  SlipResponseSuccess,
  SlipResponseError,
  QuotaResponseSuccess,
  QuotaResponseError,
  ErrorCodes,
} from "./types";

const BASE_API_URL = "https://suba.rdcw.co.th/v1/inquiry";
const PAYLOAD_TEST = "0034000600000101039990213mamauishigure5102TH91046B93"; // QR ตัวอย่าง Quota จะไม่ถูกนับ

// Constants
const DEFAULT_TIMEOUT = 10000;
const DEFAULT_RETRIES = 2;
const MIN_PAYLOAD_LENGTH = 10;

/**
 * Error codes และ messages ที่อาจเกิดขึ้น
 */
export enum RdcwErrorCode {
  INVALID_CLIENT = "INVALID_CLIENT",
  NETWORK_ERROR = "NETWORK_ERROR",
}

/**
 * Custom Error class สำหรับ SDK
 */
export class RdcwSlipError extends Error {
  constructor(
    message: string,
    public code: RdcwErrorCode,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "RdcwSlipError";
  }
}

/**
 * Type guard functions สำหรับตรวจสอบ response
 */
export const isQuotaResponse = (
  response: unknown
): response is QuotaResponseSuccess => {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === true &&
    "quota" in response
  );
};

export const isSlipResponse = (
  response: unknown
): response is SlipResponseSuccess => {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === true &&
    "valid" in response
  );
};

interface RdcwSlipConfig {
  baseUrl?: string;
  testPayload?: string;
  timeout?: number;
  retries?: number;
  logger?: Logger;
}

interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

/**
 * Class หลักสำหรับการตรวจสอบ slip และ quota
 *
 * @param clientId - รหัสลูกค้าสำหรับเข้าใช้งาน API
 * @param clientSecret - รหัสลับของลูกค้าสำหรับยืนยันตัวตน
 * @param config - ตัวเลือกการตั้งค่าเพิ่มเติม
 * @param {string} [config.baseUrl] - URL ของ API (ค่าเริ่มต้น: https://suba.rdcw.co.th/v1/inquiry)
 * @param {string} [config.testPayload] - QR Code ตัวอย่างสำหรับทดสอบเพื่อดึง quota
 * @param {number} [config.timeout] - ระยะเวลา timeout ในหน่วยมิลลิวินาที (ค่าเริ่มต้น: 10000)
 * @param {number} [config.retries] - จำนวนครั้งที่จะลองใหม่เมื่อเกิดข้อผิดพลาด (ค่าเริ่มต้น: 2)
 * @param {Logger} [config.logger] - ออบเจ็กต์สำหรับเก็บ log
 *
 * @throws {RdcwSlipError} เมื่อไม่ระบุ clientId หรือ clientSecret
 *
 * @example
 * ```typescript
 * // การใช้งานพื้นฐาน
 * const slip = new RdcwSlip("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET");
 *
 * // ตรวจสอบ quota
 * const quotaResult = await slip.checkQuota();
 *
 * // ตรวจสอบ slip
 * const slipResult = await slip.checkSlip("qr_payload_here");
 *
 * // การใช้งานพร้อม config
 * const slip = new RdcwSlip("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET", {
 *   timeout: 10000,
 *   retries: 2,
 *   logger: console,
 *   baseUrl: "https://suba.rdcw.co.th/v1/inquiry",
 *   testPayload: "test_qr_code",
 * });
 * ```
 */
export default class RdcwSlip {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly retries: number;
  private readonly payloadTest: string;
  private readonly logger?: Logger;

  constructor(clientId: string, clientSecret: string, config?: RdcwSlipConfig) {
    if (!clientId?.trim()) {
      throw new RdcwSlipError(
        "Client ID is required",
        RdcwErrorCode.INVALID_CLIENT
      );
    }
    if (!clientSecret?.trim()) {
      throw new RdcwSlipError(
        "Client Secret is required",
        RdcwErrorCode.INVALID_CLIENT
      );
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseUrl = config?.baseUrl || BASE_API_URL;
    this.timeout = config?.timeout || DEFAULT_TIMEOUT;
    this.retries = config?.retries || DEFAULT_RETRIES;
    this.payloadTest = config?.testPayload || PAYLOAD_TEST;
    this.logger = config?.logger;
  }

  private getAuthHeader(): string {
    return "Basic " + btoa(`${this.clientId}:${this.clientSecret}`);
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    attempt = 1
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      this.logger?.error(
        `Request failed (attempt ${attempt}/${this.retries}):`,
        error
      );

      if (attempt >= this.retries) {
        throw new RdcwSlipError(
          "Network request failed",
          RdcwErrorCode.NETWORK_ERROR,
          undefined,
          error
        );
      }

      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
      return this.fetchWithRetry(url, options, attempt + 1);
    }
  }

  /**
   * ตรวจสอบ quota คงเหลือ
   *
   * @returns {Promise<QuotaResponseSuccess | QuotaResponseError>} ผลการตรวจสอบ quota
   * @throws {RdcwSlipError} เมื่อเกิดข้อผิดพลาดในการเชื่อมต่อ
   */
  async checkQuota(): Promise<QuotaResponseSuccess | QuotaResponseError> {
    this.logger?.debug("Checking quota");

    try {
      const response = await this.fetchWithRetry(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: this.payloadTest }),
      });

      const data = await response.json();

      if (response.ok && !data.code && data.quota) {
        return { success: true, quota: data.quota };
      }

      if (
        (data.code && (data.code as ErrorCodes) === 10001) ||
        (data.code as ErrorCodes) === 10002
      ) {
        console.log("Test Payload is invalid, please update the test payload");
        this.logger?.error(
          "Test Payload is invalid, please update the test payload"
        );
      }

      return {
        success: false,
        code: data.code,
        message: data.message,
      };
    } catch (error) {
      if (error instanceof RdcwSlipError) {
        throw error;
      }
      throw new RdcwSlipError(
        "Network request failed",
        RdcwErrorCode.NETWORK_ERROR,
        undefined,
        error
      );
    }
  }

  /**
   * ตรวจสอบความถูกต้องของ slip
   *
   * @param {string} payload - QR Code payload ที่ต้องการตรวจสอบ
   * @returns {Promise<SlipResponseSuccess | SlipResponseError>} ผลการตรวจสอบ slip
   * @throws {RdcwSlipError} เมื่อเกิดข้อผิดพลาดในการเชื่อมต่อ
   */
  async checkSlip(
    payload: string
  ): Promise<SlipResponseSuccess | SlipResponseError> {
    if (!payload?.trim() || payload.length < MIN_PAYLOAD_LENGTH) {
      return {
        success: false,
        code: 10001,
        message: "Invalid payload",
      };
    }

    this.logger?.debug("Checking slip", { payload });

    try {
      const response = await this.fetchWithRetry(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      });

      const data = await response.json();

      if (!response.ok && data.code && !data.success) {
        return {
          success: false,
          code: data.code,
          message: data.message,
        };
      }

      return data as SlipResponseSuccess;
    } catch (error) {
      if (error instanceof RdcwSlipError) {
        throw error;
      }
      throw new RdcwSlipError(
        "Network request failed",
        RdcwErrorCode.NETWORK_ERROR,
        undefined,
        error
      );
    }
  }
}
