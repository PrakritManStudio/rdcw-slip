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

[![Github Examples](https://img.shields.io/badge/Github-View_Examples-brightgreen?style=flat-square&logo=github)](https://github.com/PrakritManStudio/rdcw-slip/tree/main/examples)

### การเริ่มต้นใช้งาน

```typescript
import RdcwSlip from "@prakrit_m/rdcw-slip";

// สร้าง instance แบบพื้นฐาน
const rdcwSlip = new RdcwSlip("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET");

// หรือกำหนด config เพิ่มเติม
const rdcwSlip = new RdcwSlip("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET", {
  timeout: 5000,
  retries: 2,
  logger: console,
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
      ชื่อผู้โอน: response.data.data.sender.name, // ชื่อบัญชีภาษาอังกฤษ
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
  baseUrl?: string; // URL ของ API (default: https://suba.rdcw.co.th/v1/inquiry)
  testPayload?: string; // ข้อมูล qrCode ทดสอบ สำหรับดึง Quota
  timeout?: number; // ระยะเวลา timeout (default: 10000ms)
  retries?: number; // จำนวนครั้งที่จะ retry (default: 2)
  logger?: Logger; // ระบบ logging
}
```

#### Methods

| Method               | Description          | Parameters        | Return Type                                           |
| -------------------- | -------------------- | ----------------- | ----------------------------------------------------- |
| `checkQuota()`       | ตรวจสอบโควต้าคงเหลือ | -                 | `Promise<QuotaResponseSuccess \| QuotaResponseError>` |
| `checkSlip(payload)` | ตรวจสอบสลิป          | `payload: string` | `Promise<SlipResponseSuccess \| SlipResponseError>`   |

## 🚨 Error Handling

### ตัวอย่างการจัดการข้อผิดพลาดเบื้องต้น

```typescript
import RdcwSlip, { RdcwSlipError, RdcwErrorCode } from "@prakrit_m/rdcw-slip";

const slip = new RdcwSlip("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET");

try {
  const result = await slip.checkSlip("QR_PAYLOAD");

  // จัดการ Error จาก API Response
  if (!result.success) {
    switch (result.code) {
      case 10001: // Invalid QR Payload
        console.error("QR Code ไม่ถูกต้อง");
        break;
      case 10002: // Not a Slip Verify API QR
        console.error("QR Code นี้ไม่ใช่ QR สำหรับตรวจสอบสลิป");
        break;
      case 21001: // Subscription Required
        console.error("กรุณาต่ออายุ subscription");
        break;
      case 40000: // IP Not Allowed
        console.error("IP ของคุณไม่ได้รับอนุญาตให้เข้าถึง API");
        break;
    }
    return;
  }

  // จัดการกรณีสำเร็จ
  console.log("ข้อมูลการโอน:", result.data);
} catch (error) {
  // จัดการ Error จาก SDK
  if (error instanceof RdcwSlipError) {
    switch (error.code) {
      case RdcwErrorCode.INVALID_CLIENT:
        console.error("ข้อมูล Client ID หรือ Client Secret ไม่ถูกต้อง");
        break;
      case RdcwErrorCode.NETWORK_ERROR:
        console.error("เกิดปัญหาในการเชื่อมต่อเครือข่าย");
        break;
    }
  }
}
```

### รหัสข้อผิดพลาด (Error Codes)

| รหัส         | คำอธิบาย                            | การแก้ไข                           |
| ------------ | ----------------------------------- | ---------------------------------- |
| 10001        | QR Code ไม่ถูกต้อง                  | ตรวจสอบความถูกต้องของ QR Code      |
| 10002        | ไม่ใช่ QR สำหรับตรวจสอบสลิป         | ใช้ QR Code จากสลิปโอนเงินเท่านั้น |
| 20001, 20002 | ไม่สามารถเชื่อมต่อกับ API ของธนาคาร | ลองใหม่ภายหลัง                     |
| 21001        | Subscription หมดอายุ/เต็มโควต้า     | ต่ออายุ subscription               |
| 40000        | IP ไม่ได้รับอนุญาต                  | ตรวจสอบ IP ที่ลงทะเบียน            |

### SDK Error Codes

| รหัส           | คำอธิบาย                   | การแก้ไข                        |
| -------------- | -------------------------- | ------------------------------- |
| INVALID_CLIENT | ข้อมูล Client ไม่ถูกต้อง   | ตรวจสอบ Client ID และ Secret    |
| NETWORK_ERROR  | ปัญหาการเชื่อมต่อเครือข่าย | ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต |

สำหรับตัวอย่างการจัดการข้อผิดพลาดแบบละเอียดเพิ่มเติม สามารถดูได้ที่ [Error Handling Example](https://github.com/PrakritManStudio/rdcw-slip/blob/main/examples/error-handling.ts)

## 🤝 การมีส่วนร่วมในการพัฒนา

1. Fork โปรเจกต์
2. สร้าง branch สำหรับฟีเจอร์ของคุณ (`git checkout -b feature/amazing-feature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'เพิ่มฟีเจอร์ใหม่'`)
4. Push ไปยัง branch (`git push origin feature/amazing-feature`)
5. เปิด Pull Request

สำหรับการรายงานปัญหาหรือข้อเสนอแนะ สามารถเปิด [Issue](https://github.com/PrakritManStudio/rdcw-slip/issues) ได้

## 📄 License

> This is a third-party SDK, not an official RDCW Slip SDK.  
> SDK นี้พัฒนาโดยบุคคลภายนอก ไม่ใช่ผลิตภัณฑ์อย่างเป็นทางการจาก RDCW Slip

Licensed under [ISC](LICENSE)

## 📚 เอกสารเพิ่มเติม

สำหรับข้อมูลเพิ่มเติมเกี่ยวกับ API สามารถอ่านได้ที่ [RDCW Slip API Documentation](https://slip.rdcw.co.th/)
