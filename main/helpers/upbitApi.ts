import axios, { AxiosRequestConfig, Method } from "axios";
import crypto from "crypto";
import uuid from "uuid";

interface Account {
  currency: string;
  balance: string;
  locked: string;
  avg_buy_price: string;
  avg_buy_price_modified: boolean;
  unit_currency: string;
}

class UpbitApi {
  private accessKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor(accessKey: string, secretKey: string) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.baseUrl = "https://api.upbit.com/v1";
  }

  async getAccounts(): Promise<Account[]> {
    return this.request("GET", "/accounts", {}, true);
  }

  private async request<T>(
    method: Method,
    path: string,
    params: any = {},
    authRequired: boolean = false,
  ): Promise<T> {
    const options: AxiosRequestConfig = {
      method,
      url: `${this.baseUrl}${path}`,
      params: method === "GET" ? params : undefined,
      data: method !== "GET" ? params : undefined,
    };

    if (authRequired) {
      options.headers = this.getAuthHeaders(method, path, params);
    }

    try {
      const response = await axios(options);
      return response.data;
    } catch (err) {
      console.error("API request failed:::", err);
      throw err;
    }
  }

  private getAuthHeaders(
    method: string,
    path: string,
    params: any,
  ): Record<string, string> {
    const query =
      method === "GET" ? new URLSearchParams(params).toString() : "";
    const payload = query ? `${path}?${query}` : path;
    const nonce = uuid.v4();
    const hash = crypto.createHash("sha512");
    const queryHash = hash.update(payload).digest("hex");

    const signaturePayload = `${method}\n${path}\n${nonce}\n${queryHash}`;
    const signature = crypto
      .createHmac("sha512", this.secretKey)
      .update(signaturePayload)
      .digest("hex");

    return {
      "Access-Key": this.accessKey,
      Nonce: nonce,
      Authorization: `Bearer ${signature}`,
      "Content-Type": "application/json",
    };
  }
}

export default UpbitApi;
