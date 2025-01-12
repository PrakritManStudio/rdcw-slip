# 🚀 RDCW Slip SDK

RdcwSlip SDK ช่วยให้คุณสามารถโต้ตอบกับ RDCW Slip API เพื่อเช็คโควต้าและสลิปได้

![NPM Last Update](https://img.shields.io/npm/last-update/%40prakrit_m%2Frdcw-slip)
[![NPM Downloads](https://img.shields.io/npm/dm/%40prakrit_m/rdcw-slip)](https://www.npmjs.org/package/@prakrit_m/rdcw-slip)
[![NPM version](https://img.shields.io/npm/v/@prakrit_m/rdcw-slip.svg?style=flat)](https://www.npmjs.org/package/@prakrit_m/rdcw-slip)

### ✨ Features

- รองรับ TypeScript
- เช็คจำนวนโควต้าคงเหลือ (`checkQuota`)
- เช็คสลิปด้วยข้อมูลต่างๆ (`checkSlip`)

## 📦 Installation

```bash
# npm
npm install @prakrit_m/rdcw-slip

# yarn
yarn add @prakrit_m/rdcw-slip
```

## 📖 Usage

### การนำเข้า SDK

```typescript
import RdcwSlip from "@prakrit_m/rdcw-slip";
```

### 🏗️ การสร้างอินสแตนซ์

```typescript
const rdcwSlip = new RdcwSlip("your-client-id", "your-client-secret");
```

### ⚙️ เมธอด

#### `checkQuota()`

เช็คจำนวนโควต้าคงเหลือ

```typescript
const quotaResponse = await rdcwSlip.checkQuota();
if (quotaResponse.success) {
  console.log("ข้อมูลโควต้า:", quotaResponse.quota);
} else {
  console.error(
    "รหัสข้อผิดพลาด:",
    quotaResponse.code,
    "ข้อความ:",
    quotaResponse.message
  );
}
```

**Return Type:**

- `Promise<QuotaResponseSuccess | QuotaResponseError>`

##### `QuotaResponseSuccess`:

```typescript
type QuotaResponseSuccess = {
  success: true;
  quota: Quota;
};
```

##### `QuotaResponseError`:

```typescript
type QuotaResponseError = {
  success: false;
  code: ErrorCodes;
  message: string;
};
```

#### **`checkSlip(payload: string)`**

เช็คสลิปด้วยข้อมูลใน qr code

```typescript
const payload = "your-payload-string";
const slipResponse = await rdcwSlip.checkSlip(payload);
if (slipResponse.success) {
  console.log("ข้อมูลสลิป:", slipResponse.data);
} else {
  console.error(
    "รหัสข้อผิดพลาด:",
    slipResponse.code,
    "ข้อความ:",
    slipResponse.message
  );
}
```

**Return Type:**

- `Promise<SlipResponseSuccess | SlipResponseError>`

##### `SlipResponseSuccess`:

```typescript
type SlipResponseSuccess = {
  success: true;
  discriminator: string;
  valid: boolean;
  data: Data1;
  quota: Quota;
  subscription: Subscription;
  isCached: boolean;
};
```

##### `SlipResponseError`:

```typescript
type SlipResponseError = {
  success: false;
  code: ErrorCodes;
  message: string;
};
```

## 🛠 Error Codes

| Code         | Description                                        | คำอธิบาย                                                                     |
| ------------ | -------------------------------------------------- | ---------------------------------------------------------------------------- |
| 0            | Invalid Data                                       | การเรียกข้อมูลไม่ได้แนบ Payload หรือแนบ Payload ผ่านรูปแบบอื่นที่ไม่ใช่ JSON |
| 10001        | Invalid QR Payload                                 | Payload ที่แนบมาไม่ถูกต้อง มีลิ้งค์หรือข้อความอื่นปะปนมา                     |
| 10002        | This is not a Slip Verify API QR                   | Payload ที่แนบมาไม่ใช่จากสลิปการทำรายการผ่าน Mobile Banking                  |
| 20001, 20002 | Unable to connect to Bank API at this moment       | ไม่สามารถทำรายการกับทางธนาคารได้                                             |
| 21001        | Please renew your subscription before using API    | Subscription หมดอายุหรือใช้เต็มโควต้าแล้ว                                    |
| 40000        | Your IP address are not allowed to access this API | ไอพีของคุณไม่ตรงกับที่ได้กรอกไว้ใน Application                               |

## 📚 Documentation

อ่าน RDCW Slip API Documentation ได้ที่ [RDCW Slip API Documentation](https://slip.rdcw.co.th/)

## 📄 License

> This is a third-party SDK, not an official RDCW Slip SDK.  
> SDK นี้พัฒนาโดยบุคคลภายนอก ไม่ใช่ผลิตภัณฑ์อย่างเป็นทางการจาก RDCW Slip

[ISC](LICENSE)
