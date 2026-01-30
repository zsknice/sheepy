// 页面加载完成后执行（保证获取到DOM元素）
document.addEventListener('DOMContentLoaded', function() {
  console.log("设备震动功能检查:");
  console.log("navigator.vibrate:", navigator.vibrate);
  console.log("qq对象:", typeof qq !== 'undefined' ? "存在" : "不存在");

  // 敲打按钮点击事件
  document.getElementById('poundButton').addEventListener('click', function() {
    const image = document.getElementById('poundableImage');
    const fist = document.getElementById('fist');
    
    // 立即触发震动
    triggerVibration();
    // 添加晃动类到图像
    image.classList.add('shake');
    // 显示拳头击打动画
    fist.classList.add('punch-animation');
    // 动画结束后移除类（和动画时长保持一致）
    setTimeout(function() {
      image.classList.remove('shake');
      fist.classList.remove('punch-animation');
    }, 600);
  });

  // 更换图片按钮点击事件
  document.getElementById('changeImageButton').addEventListener('click', function() {
    document.getElementById('imageUpload').click();
  });

  // 文件选择后预览并替换图片
  document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        document.getElementById('poundableImage').src = event.target.result;
      }
      reader.readAsDataURL(file);
    }
  });
});

// 优化的震动函数（兼容QQ浏览器+标准API+webkit前缀）
function triggerVibration() {
  console.log("尝试触发震动...");
  
  // 1. 先尝试QQ浏览器专用API
  if (typeof qq !== 'undefined') {
    console.log("使用QQ浏览器API");
    try {
      // 尝试短震动
      if (qq.vibrateShort) {
        qq.vibrateShort({
          success: () => console.log("QQ短震动成功"),
          fail: (err) => {
            console.log("QQ短震动失败:", err);
            // 短震动失败尝试长震动
            if (qq.vibrateLong) {
              qq.vibrateLong({
                success: () => console.log("QQ长震动成功"),
                fail: (err2) => {
                  console.log("QQ长震动失败:", err2);
                  tryStandardVibration();
                }
              });
            } else {
              tryStandardVibration();
            }
          }
        });
      } else {
        tryStandardVibration();
      }
    } catch(e) {
      console.log("QQ浏览器API异常:", e);
      tryStandardVibration();
    }
  } else {
    // 2. 使用标准震动API
    tryStandardVibration();
  }

  // 标准震动API兼容处理
  function tryStandardVibration() {
    console.log("尝试标准震动API");
    if (navigator.vibrate) {
      try {
        navigator.vibrate(200); // 单次震动200ms
        console.log("标准震动API调用成功");
      } catch(e) {
        console.log("标准震动API异常:", e);
      }
    } 
    // 兼容webkit内核浏览器（如部分安卓浏览器）
    else if (navigator.webkitVibrate) {
      navigator.webkitVibrate(200);
      console.log("webkit震动API调用成功");
    } 
    // 提示iOS设备特殊处理
    else if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      console.log("iOS设备可能需要特殊震动处理");
    } else {
      console.log("设备不支持震动API");
    }
  }
}