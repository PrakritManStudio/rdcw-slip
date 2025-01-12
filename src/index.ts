import {
  SlipResponseSuccess,
  SlipResponseError,
  QuotaResponseSuccess,
  QuotaResponseError,
} from "./types";

const BASE_API_URL = "https://suba.rdcw.co.th/v1/inquiry";
const PAYLOAD_TEST = "0034000600000101039990213mamauishigure5102TH91046B93";

export default class RdcwSlip {
  private clientId: string;
  private clientSecret: string;
  public payloadTest: string;

  constructor(clientId: string, clientSecret: string) {
    if (!clientId || typeof clientId !== "string") {
      throw Error("RdcwSlip: Client ID is invalid");
    }
    if (!clientSecret || typeof clientSecret !== "string") {
      throw Error("RdcwSlip: Client Secret is invalid");
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.payloadTest = PAYLOAD_TEST;
  }
  async checkQuota(): Promise<QuotaResponseSuccess | QuotaResponseError> {
    const url = `${BASE_API_URL}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + btoa(this.clientId + ":" + this.clientSecret),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: this.payloadTest }),
      });
      const resData = await response.json();
      if (response.status >= 200 && response.status <= 299 && !resData?.code) {
        const { quota } = resData;
        return { success: true, quota } as QuotaResponseSuccess;
      }
      const { code, message } = resData;
      return { success: false, code, message } as QuotaResponseError;
    } catch (error) {
      console.error("RdcwSlip: Error fetching quota:", error);
      throw error;
    }
  }

  async checkSlip(
    payload: string
  ): Promise<SlipResponseSuccess | SlipResponseError> {
    const url = `${BASE_API_URL}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + btoa(this.clientId + ":" + this.clientSecret),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      });
      const resData = await response.json();
      if (response.status >= 200 && response.status <= 299 && !resData?.code) {
        const { discriminator, valid, data, quota, subscription, isCached } =
          resData;
        return {
          success: true,
          discriminator,
          valid,
          data,
          quota,
          subscription,
          isCached,
        } as SlipResponseSuccess;
      }
      const { code, message } = resData;
      return { success: false, code, message } as SlipResponseError;
    } catch (error) {
      console.error("RdcwSlip: Error fetching slip:", error);
      throw error;
    }
  }
}