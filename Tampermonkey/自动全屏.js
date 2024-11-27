// ==UserScript==
// @name         自动全屏
// @name:en      Automatic full screen
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description:zh-CN  自动实现B站和YouTube网页视频的全屏观看功能。  
// @description  Automatically realize the full-screen viewing function of Bilibili and YouTube web videos.
// @author       屑屑
// @icon         https://s2.loli.net/2024/04/28/WEkjH9iy51z63Of.jpg
// @license      MIT
// @match        *://www.youtube.com/watch*
// @match        *://www.bilibili.com/video/*
// @license      MIT
// @downloadURL  https://update.greasyfork.org/scripts/518562/%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.user.js
// @updateURL    https://update.greasyfork.org/scripts/518562/%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

window.onload = () => {
    // YouTube 和 Bilibili 的全屏按钮选择器
    const youtubeSelector = "button.ytp-fullscreen-button.ytp-button";
    const bilibiliSelector = "#bilibili-player .bpx-player-ctrl-web";
    const videoSelector = "video";  // 视频元素的通用选择器

    let isFullscreen = false;  // 标记是否已进入全屏模式

    // 等待元素加载的通用函数
    const waitForElement = (selector) => {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
            }, 500); // 每500毫秒检查一次
        });
    };

    // 执行点击操作
    const clickButton = async (selector, platform) => {
        try {
            const button = await waitForElement(selector);
            button.click();
            console.log(`${platform} 全屏按钮已点击！`);
        } catch (error) {
            console.error(`${platform} 全屏按钮未找到！`, error);
        }
    };

    // 直接进入全屏
    const enterFullscreen = () => {
        const videoElement = document.querySelector(videoSelector);
        if (videoElement) {
            try {
                if (videoElement.requestFullscreen) {
                    videoElement.requestFullscreen();
                    console.log("已进入全屏模式");
                } else {
                    console.error("该浏览器不支持 requestFullscreen");
                }
            } catch (error) {
                console.error("进入全屏模式时发生错误:", error.message);
            }
        } else {
            console.error("未找到视频元素");
        }
    };

    // 持续监听视频尺寸变化
    const observeVideoSize = (videoElement) => {
        const initialWidth = videoElement.offsetWidth;
        const initialHeight = videoElement.offsetHeight;

        // 创建 ResizeObserver 来观察视频尺寸变化
        const resizeObserver = new ResizeObserver(() => {
            const currentWidth = videoElement.offsetWidth;
            const currentHeight = videoElement.offsetHeight;

            // 如果视频尺寸发生变化，说明全屏成功
            if (currentWidth !== initialWidth || currentHeight !== initialHeight) {
                console.log("视频尺寸已变化，进入全屏成功！");
                resizeObserver.disconnect();  // 停止监听尺寸变化
                isFullscreen = true;  // 标记已进入全屏
            }
        });

        resizeObserver.observe(videoElement);  // 开始监听
    };

    // 模拟点击全屏按钮并监听视频尺寸变化
    const handlePlatform = async () => {
        if (window.location.hostname.includes('youtube.com')) {
            await clickButton(youtubeSelector, 'YouTube');
        } else if (window.location.hostname.includes('bilibili.com')) {
            await clickButton(bilibiliSelector, 'Bilibili');
        }

        // 获取视频元素并开始观察其尺寸变化
        const videoElement = await waitForElement(videoSelector);
        observeVideoSize(videoElement);

        // 如果视频尺寸没有变化，逐步尝试其他方式进入全屏
        const tryFullscreenUntilSuccess = () => {
            const videoElement = document.querySelector(videoSelector);

            if (!isFullscreen) {
                setTimeout(() => {
                    const currentWidth = videoElement.offsetWidth;
                    const currentHeight = videoElement.offsetHeight;

                    // 如果尺寸没有变化，则尝试强制进入全屏
                    if (currentWidth === videoElement.offsetWidth && currentHeight === videoElement.offsetHeight) {
                        console.log("视频尺寸未变化，尝试其他方式进入全屏...");

                        // 尝试通过其他方式进入全屏
                        enterFullscreen();

                        // 继续尝试直到成功
                        tryFullscreenUntilSuccess();
                    } else {
                        console.log("成功进入全屏！");
                    }
                }, 1000);  // 每1秒检查一次
            }
        };

        // 启动持续检测
        tryFullscreenUntilSuccess();
    };

    // 执行平台操作
    handlePlatform();
};
