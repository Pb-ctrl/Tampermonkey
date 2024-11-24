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
// @downloadURL https://update.greasyfork.org/scripts/518562/%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/518562/%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

// 等待页面加载完成
window.onload = function() {
    // YouTube 控制按钮选择器
    const youtubeSelector = "button.ytp-fullscreen-button.ytp-button";

    // Bilibili 控制按钮选择器
    const bilibiliSelector = "#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-web";

    // 等待并返回 Bilibili 控制按钮的函数
    function waitForBilibiliButton() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const button = document.querySelector(bilibiliSelector);
                if (button) {
                    clearInterval(interval);
                    resolve(button);
                }
            }, 100); // 每100毫秒检查一次
        });
    }

    // 等待并返回 YouTube 控制按钮的函数
    function waitForYoutubeButton() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const button = document.querySelector(youtubeSelector);
                if (button) {
                    clearInterval(interval);
                    resolve(button);
                }
            }, 100); // 每100毫秒检查一次
        });
    }

    // 模拟点击 Bilibili 控制按钮的函数
    async function clickBilibiliButton() {
        try {
            const controlButton = await waitForBilibiliButton();
            if (controlButton) {
                controlButton.click();
                console.log('Bilibili 控制按钮已点击！');
            } else {
                console.error('未找到 Bilibili 控制按钮！');
            }
        } catch (error) {
            console.error('Bilibili 错误:', error);
        }
    }

    // 模拟点击 YouTube 全屏按钮的函数
    async function clickYoutubeButton() {
        try {
            const controlButton = await waitForYoutubeButton();
            if (controlButton) {
                (function () {
                    // 定义一个全屏触发函数
                    function enterFullscreen() {
                        try {
                            const videoElement = document.querySelector('video');
                            if (!videoElement) {
                                alert('未找到视频元素');
                                return false; // 未找到视频，任务未完成
                            }
                            if (videoElement.requestFullscreen) {
                                videoElement.requestFullscreen();
                                console.log('已进入全屏模式');
                                return true; // 成功执行全屏，任务完成
                            } else {
                                console.error('该浏览器不支持 requestFullscreen');
                                return false; // 不支持全屏，任务未完成
                            }
                        } catch (error) {
                            console.error('发生错误:', error.message);
                            return false; // 出现错误，任务未完成
                        }
                    }

                    // 监听用户点击事件
                    const handleClick = () => {
                        const success = enterFullscreen();
                        if (success) {
                            // 如果任务完成，移除事件监听并停止脚本运行
                            document.removeEventListener('click', handleClick);
                            console.log('脚本已完成运行，停止监听');
                        }
                    };

                    // 添加点击事件监听
                    document.addEventListener('click', handleClick);

                })();
            } else {
                console.error('未找到 YouTube 全屏按钮！');
            }
        } catch (error) {
            console.error('YouTube 错误:', error);
        }
    }

    // 检查当前页面是否是 YouTube，执行对应的函数
    if (window.location.hostname.includes('youtube.com')) {
        clickYoutubeButton(); // 如果是 YouTube 页面，点击全屏按钮
    } else if (window.location.hostname.includes('bilibili.com')) {
        clickBilibiliButton(); // 如果是 Bilibili 页面，点击控制按钮
    }
};