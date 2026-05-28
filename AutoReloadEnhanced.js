// ==UserScript==
// @name         Auto Reload Random Enhanced
// @namespace    https://github.com/githuba/userscripts_me
// @version      4.2
// @description  Smart random auto reload with human-like behavior
// @author       githuba
// @run-at       document-end

// ===== Sites =====
/* @include     https://*.tgfcer.com/* */
/* @include     http://bbs.weibufengge.com/forum.php?mod=forumdisplay* */
/* @include     http://bbs.weibufengge.com:88/forum.php?mod=forumdisplay* */
/* @include     http://bbs.weibufengge.com/forum.php?mod=guide* */
/* @include     http://bbs.weibufengge.com:88/forum.php?mod=guide* */
/* @include     https://keylol.com/forum.php?mod=forumdisplay* */
/* @include     https://keylol.com/forum.php?mod=guide* */
/* @include     https://na.alienwarearena.com/* */
/* @include     https://www.steamgifts.com/* */
/* @include     https://www.hi-pda.com/forum/forumdisplay.php?* */
/* @include     https://www.hostloc.com/forum.php?mod=forumdisplay&fid=45&filter=author&orderby=dateline* */
/* @include     https://pt.m-team.cc/browse* */
/* @include     https://pt.m-team.cc/browse/adult* */
/* @include     https://karagarga.in/browse.php?* */

// ==/UserScript==

(function () {

    'use strict';

    // =====================================================
    // CONFIG
    // =====================================================

    const CONFIG = {

        // 基础刷新时间
        minMinutes: 2,
        maxMinutes: 5,

        // 后台标签页增加延迟
        hiddenExtraMinutes: 2,

        // 重试时间
        retryMinSeconds: 30,
        retryMaxSeconds: 90,

        // 抖动（秒）
        jitterSeconds: 20,

        // 是否输出日志
        debug: true,

        // 夜间随机休眠
        enableNightPause: true
    };

    // =====================================================
    // LOG
    // =====================================================

    function log(...args) {

        if (CONFIG.debug) {

            console.log(
                '[AutoReload]',
                ...args
            );
        }
    }

    // =====================================================
    // RANDOM
    // =====================================================

    function rand(min, max) {

        return Math.random() * (max - min) + min;
    }

    function randInt(min, max) {

        return Math.floor(rand(min, max + 1));
    }

    // =====================================================
    // HUMAN DELAY
    // =====================================================

    function getReloadDelay() {

        let minutes = rand(
            CONFIG.minMinutes,
            CONFIG.maxMinutes
        );

        // 后台页面增加延迟
        if (document.hidden) {

            minutes += rand(
                0,
                CONFIG.hiddenExtraMinutes
            );
        }

        // 夜间随机长暂停
        if (CONFIG.enableNightPause) {

            const hour = new Date().getHours();

            if (hour >= 2 && hour <= 7) {

                if (Math.random() < 0.35) {

                    const extra = rand(15, 60);

                    log(
                        `Night pause +${extra.toFixed(1)} min`
                    );

                    minutes += extra;
                }
            }
        }

        // 抖动
        const jitter = randInt(
            -CONFIG.jitterSeconds,
            CONFIG.jitterSeconds
        );

        return (
            minutes * 60 + jitter
        ) * 1000;
    }

    // =====================================================
    // SAFETY
    // =====================================================

    function shouldReload() {

        // 网络断开
        if (!navigator.onLine) {

            log('Offline');

            return false;
        }

        // 用户正在输入
        const active = document.activeElement;

        if (
            active &&
            (
                active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                active.isContentEditable
            )
        ) {

            log('User typing');

            return false;
        }

        return true;
    }

    // =====================================================
    // RELOAD
    // =====================================================

    function reloadPage() {

        // 更像真人行为的小延迟
        const wait = randInt(1000, 8000);

        log(`Reload after ${wait / 1000}s`);

        setTimeout(() => {

            // 某些站点缓存 aggressive
            // 加时间戳避免假刷新

            const url = new URL(location.href);

            url.searchParams.set(
                '_',
                Date.now().toString()
            );

            log('Reloading...');

            location.href = url.toString();

        }, wait);
    }

    // =====================================================
    // MAIN
    // =====================================================

    function scheduleReload() {

        const delay = getReloadDelay();

        log(
            `Next reload in ${(delay / 60000).toFixed(2)} min`
        );

        setTimeout(() => {

            if (!shouldReload()) {

                const retry = randInt(
                    CONFIG.retryMinSeconds,
                    CONFIG.retryMaxSeconds
                ) * 1000;

                log(
                    `Retry after ${retry / 1000}s`
                );

                // 这里只重新调度一次
                setTimeout(scheduleReload, retry);

                return;
            }

            reloadPage();

            // 下一轮
            scheduleReload();

        }, delay);
    }

    // =====================================================
    // START
    // =====================================================

    // 初始随机等待
    const startupDelay = randInt(5, 30) * 1000;

    log(
        `Startup after ${startupDelay / 1000}s`
    );

    setTimeout(scheduleReload, startupDelay);

})();
