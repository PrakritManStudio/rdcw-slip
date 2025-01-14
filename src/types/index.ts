export type BankCode =
  | "002" // BBL - ธนาคารกรุงเทพ
  | "004" // KBANK - ธนาคารกสิกรไทย
  | "006" // KTB - ธนาคารกรุงไทย
  | "011" // TTB - ธนาคารทหารไทยธนชาต
  | "014" // SCB - ธนาคารไทยพาณิชย์
  | "025" // BAY - ธนาคารกรุงศรีอยุธยา
  | "069" // KKP - ธนาคารเกียรตินาคินภัทร
  | "022" // CIMBT - ธนาคารซีไอเอ็มบีไทย
  | "067" // TISCO - ธนาคารทิสโก้
  | "024" // UOBT - ธนาคารยูโอบี
  | "071" // TCD - ธนาคารไทยเครดิตเพื่อรายย่อย
  | "073" // LHFG - ธนาคารแลนด์ แอนด์ เฮ้าส์
  | "070" // ICBCT - ธนาคารไอซีบีซี (ไทย)
  | "098" // SME - ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย
  | "034" // BAAC - ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร
  | "035" // EXIM - ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย
  | "030" // GSB - ธนาคารออมสิน
  | "033"; // GHB - ธนาคารอาคารสงเคราะห์

export type ErrorCodes =
  | 0 // Invalid Data
  | 10001 // Invalid QR Payload
  | 10002 // This is not a Slip Verify API QR
  | 20001 // Unable to connect to Bank API at this moment
  | 20002 // Unable to connect to Bank API at this moment
  | 21001 // Please renew your subscription before using API
  | 40000; // Your IP address are not allowed to access this API

export type QuotaResponseSuccess = {
  success: true;
  quota: Quota;
};
export type QuotaResponseError = {
  success: false;
  code: ErrorCodes;
  message: string;
};

export type SlipResponseSuccess = {
  success: true;
  discriminator: string;
  valid: boolean;
  data: Data1;
  quota: Quota;
  subscription: Subscription;
  isCached: boolean;
};

export type SlipResponseError = {
  success: false;
  code: ErrorCodes;
  message: string;
};

export type Quota = {
  cost?: number;
  usage: number;
  limit: number;
};

export type Subscription = {
  id: string;
  postpaid: boolean;
};

export type Proxy = {
  type: "NATID" | "MSISDN" | "EWALLETID" | "EMAIL" | "BILLERID" | null;
  value: string | null;
};

export type Account = {
  type: "BANKAC" | "TOKEN" | "DUMMY" | "";
  value: string;
};

export type Sender = {
  displayName: string;
  name: string;
  proxy: Proxy;
  account: Account;
};

export type Receiver = {
  displayName: string;
  name: string;
  proxy: Proxy;
  account: Account;
};

export type Data1 = {
  data: Data2;
  rqUID: string;
  kbankTxnId: string;
  statusCode: string;
  statusMessage: string;
};

export type Data2 = {
  language: "TH" | "EN";
  transRef: string;
  sendingBank: BankCode | "";
  receivingBank: BankCode | "";
  transDate: string;
  transTime: string;
  sender: Sender;
  receiver: Receiver;
  amount: number;
  paidLocalAmount: number;
  paidLocalCurrency: string;
  countryCode: string;
  transFeeAmount: number;
  ref1: string;
  ref2: string;
  ref3: string;
  toMerchantId: string;
};
