# 🚀 RDCW Slip SDK

[![NPM version](https://img.shields.io/npm/v/@prakrit_m/rdcw-slip.svg?style=flat)](https://www.npmjs.org/package/@prakrit_m/rdcw-slip)
[![NPM Downloads](https://img.shields.io/npm/dm/%40prakrit_m/rdcw-slip)](https://www.npmjs.org/package/@prakrit_m/rdcw-slip)
![NPM Last Update](https://img.shields.io/npm/last-update/%40prakrit_m%2Frdcw-slip)
![Node Version](https://img.shields.io/node/v/@prakrit_m/rdcw-slip)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

SDK สำหรับตรวจสอบสลิปและโควต้าผ่าน RDCW Slip API อย่างง่ายดาย พร้อมรองรับ TypeScript แบบสมบูรณ์

## 📋 สารบัญ

- [คุณสมบัติ](#-คุณสมบัติ)
- [การติดตั้ง](#-การติดตั้ง)
- [การใช้งาน](#-การใช้งาน)
- [API Reference](#-api-reference)
- [Error Handling](#-error-handling)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ คุณสมบัติ

- 🔄 ตรวจสอบสลิปและโควต้าแบบ Real-time
- 📝 รองรับ TypeScript แบบสมบูรณ์
- 🔒 ระบบจัดการ Error ที่ครอบคลุม
- 🚀 Retry mechanism อัตโนมัติ
- ⏱️ Timeout handling
- 📊 Logging system

## 📦 การติดตั้ง

```bash
# npm
npm install @prakrit_m/rdcw-slip

# yarn
yarn add @prakrit_m/rdcw-slip

# pnpm
pnpm add @prakrit_m/rdcw-slip
```

## 🚀 การใช้งาน

![Static Badge](https://img.shields.io/badge/Github-View_Examples-brightgreen?style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2FPrakritManStudio%2Frdcw-slip%2Ftree%2Fmain%2Fexamples)


### การเริ่มต้นใช้งาน

```typescript
import RdcwSlip from "@prakrit_m/rdcw-slip";

// สร้าง instance แบบพื้นฐาน
const rdcwSlip = new RdcwSlip("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET");

// หรือกำหนด config เพิ่มเติม
const rdcwSlip = new RdcwSlip("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET", {
  timeout: 5000,
  retries: 2,
  logger: console
});
```

### ตรวจสอบโควต้า

```typescript
try {
  const response = await rdcwSlip.checkQuota();
  if (response.success) {
    console.log("โควต้าคงเหลือ:", response.quota.limit - response.quota.usage);
  } else {
    console.error("เกิดข้อผิดพลาด:", response.message);
  }
} catch (error) {
  console.error("เกิดข้อผิดพลาดในการเชื่อมต่อ:", error);
}
```

### ตรวจสอบสลิป

```typescript
try {
  const response = await rdcwSlip.checkSlip("QR_PAYLOAD_HERE");
  if (response.success) {
    console.log("ข้อมูลการโอน:", {
      จำนวนเงิน: response.data.data.amount, // หน่วยสตางค์
      วันที่โอน: response.data.data.transDate, // เช่น "20230708"
      เวลาที่โอน: response.data.data.transTime, // เช่น "12:51:57"
      ธนาคารผู้โอน: response.data.data.sendingBank, // รหัสธนาคาร
      ชื่อผู้โอน: response.data.data.sender.name // ชื่อบัญชีภาษาอังกฤษ
    });
  } else {
    console.error("เกิดข้อผิดพลาด:", response.message);
  }
} catch (error) {
  console.error("เกิดข้อผิดพลาดในการเชื่อมต่อ:", error);
}
```

### ตัวอย่างการใช้งานเพิ่มเติม

- [Basic Usage](https://github.com/PrakritManStudio/rdcw-slip/blob/main/examples/basic-usage.ts) - ตัวอย่างการใช้งานพื้นฐาน
- [Advanced Usage](https://github.com/PrakritManStudio/rdcw-slip/blob/main/examples/advanced-usage.ts) - ตัวอย่างการใช้งานขั้นสูง
- [Error Handling](https://github.com/PrakritManStudio/rdcw-slip/blob/main/examples/error-handling.ts) - ตัวอย่างการจัดการข้อผิดพลาด

## 📚 API Reference

### RdcwSlip

#### Constructor Options

```typescript
interface RdcwSlipConfig {
  baseUrl?: string;      // URL ของ API (default: https://suba.rdcw.co.th/v1/inquiry)
  testPayload?: string;  // ข้อมูล qrCode ทดสอบ สำหรับดึง Quota
  timeout?: number;      // ระยะเวลา timeout (default: 10000ms)
  retries?: number;      // จำนวนครั้งที่จะ retry (default: 2)
  logger?: Logger;       // ระบบ logging
}
```

#### Methods

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `checkQuota()` | ตรวจสอบโควต้าคงเหลือ | - | `Promise<QuotaResponseSuccess \| QuotaResponseError>` |
| `checkSlip(payload)` | ตรวจสอบสลิป | `payload: string` | `Promise<SlipResponseSuccess \| SlipResponseError>` |

## 🚨 Error Handling

### Error Codes

| Code | Description | คำอธิบาย |
|------|-------------|----------|
| 0 | Invalid Data | การเรียกข้อมูลไม่ได้แนบ Payload หรือแนบ Payload ผ่านรูปแบบอื่น |
| 10001 | Invalid QR Payload | Payload ที่แนบมาไม่ถูกต้อง |
| 10002 | Not a Slip Verify API QR | Payload ไม่ใช่จากสลิป Mobile Banking |
| 20001, 20002 | Bank API Connection Error | ไม่สามารถเชื่อมต่อกับธนาคารได้ |
| 21001 | Subscription Required | Subscription หมดอายุหรือใช้เต็มโควต้า |
| 40000 | IP Not Allowed | IP ไม่ตรงกับที่ลงทะเบียน |

### การจัดการ Error

```typescript
try {
  const response = await rdcwSlip.checkSlip(payload);
  // handle success
} catch (error) {
  if (error instanceof RdcwSlipError) {
    switch (error.code) {
      case RdcwErrorCode.INVALID_CLIENT:
        // handle invalid credentials
        break;
      case RdcwErrorCode.NETWORK_ERROR:
        // handle network issues
        break;
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

> This is a third-party SDK, not an official RDCW Slip SDK.  
> SDK นี้พัฒนาโดยบุคคลภายนอก ไม่ใช่ผลิตภัณฑ์อย่างเป็นทางการจาก RDCW Slip

Licensed under [ISC](LICENSE)

## 📚 เอกสารเพิ่มเติม

สำหรับข้อมูลเพิ่มเติมเกี่ยวกับ API สามารถอ่านได้ที่ [RDCW Slip API Documentation](https://slip.rdcw.co.th/)
