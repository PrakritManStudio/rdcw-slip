import RdcwSlip, { RdcwSlipError, RdcwErrorCode } from "@prakrit_m/rdcw-slip";

/**
 * ตัวอย่างการจัดการข้อผิดพลาดของ RDCW Slip SDK
 * 
 * ตัวอย่างนี้แสดงวิธีการ:
 * 1. จัดการข้อผิดพลาดจาก API Response
 * 2. จัดการข้อผิดพลาดจาก SDK
 * 3. แสดงข้อความแจ้งเตือนที่เหมาะสมสำหรับแต่ละกรณี
 */

const slip = new RdcwSlip("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET");

/**
 * ฟังก์ชันตรวจสอบสลิปพร้อมการจัดการข้อผิดพลาดแบบละเอียด
 * @param payload - ข้อมูล QR Code จากสลิป
 */
async function handleSlipVerification(payload: string) {
  try {
    const result = await slip.checkSlip(payload);
    
    // จัดการกรณี API ตอบกลับว่าไม่สำเร็จ
    if (!result.success) {
      switch (result.code) {
        case 10001:
          console.error("QR Code ไม่ถูกต้อง");
          break;
        case 10002:
          console.error("QR Code นี้ไม่ใช่ QR สำหรับตรวจสอบสลิป");
          break;
        case 20001:
        case 20002:
          console.error("ไม่สามารถเชื่อมต่อกับ API ของธนาคารได้");
          break;
        case 21001:
          console.error("กรุณาต่ออายุ subscription");
          break;
        case 40000:
          console.error("IP ของคุณไม่ได้รับอนุญาตให้เข้าถึง API");
          break;
        default:
          console.error("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
      }
      return;
    }

    console.log("ตรวจสอบสลิปสำเร็จ:", result);
    
  } catch (error) {
    // จัดการข้อผิดพลาดจาก SDK
    if (error instanceof RdcwSlipError) {
      switch (error.code) {
        case RdcwErrorCode.INVALID_CLIENT:
          console.error("ข้อมูล Client ไม่ถูกต้อง");
          break;
        case RdcwErrorCode.NETWORK_ERROR:
          console.error("เกิดปัญหาในการเชื่อมต่อเครือข่าย");
          break;
      }
    } else {
      // จัดการข้อผิดพลาดอื่นๆ ที่ไม่ได้มาจาก SDK
      console.error("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ:", error);
    }
  }
}

// ทดสอบการจัดการข้อผิดพลาดด้วย payload ที่ไม่ถูกต้อง
handleSlipVerification("invalid_payload"); 