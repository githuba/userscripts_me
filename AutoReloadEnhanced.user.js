// ==UserScript==
// @name         Auto Reload Random Enhanced
// @namespace    https://github.com/githuba/userscripts_me
// @version      4.2
// @description  Smart random auto reload with human-like behavior
// @author       githuba
// @run-at       document-end
// @match        https://*.tgfcer.com/*
// @match        http://bbs.weibufengge.com/forum.php?mod=forumdisplay*
// @match        http://bbs.weibufengge.com:88/forum.php?mod=forumdisplay*
// @match        http://bbs.weibufengge.com/forum.php?mod=guide*
// @match        http://bbs.weibufengge.com:88/forum.php?mod=guide*
// @match        https://keylol.com/forum.php?mod=forumdisplay*
// @match        https://keylol.com/forum.php?mod=guide*
// @match        https://na.alienwarearena.com/*
// @match        https://www.steamgifts.com/*
// @match        https://www.hi-pda.com/forum/forumdisplay.php?*
// @match        https://www.hostloc.com/forum.php?mod=forumdisplay&fid=45&filter=author&orderby=dateline*
// @match        https://pt.m-team.cc/browse*
// @match        https://pt.m-team.cc/browse/adult*
// @match        https://karagarga.in/browse.php?*

// @grant        none

// ==/UserScript==

(function () {

    'use strict';

    // =====================================================
    // CONFIG
    // =====================================================

    const CONFIG = {

        // 基础刷新时间（分钟）
        minMinutes: 2,
        maxMinutes: 5,

        // 页面隐藏时额外延迟（分钟）
        hiddenExtraMinutes: 2,

        // 重试等待（秒）
        retryMinSeconds: 30,
        retryMaxSeconds: 90,

        // 时间抖动（秒）
        jitterSeconds: 20,

        // 是否输出日志
        debug: true,

        // 夜间随机暂停
        enableNightPause: true,

        // 启动随机延迟
        startupMinSeconds: 5,
        startupMaxSeconds: 30,

        // 刷新前随机等待
        reloadWaitMinSeconds: 1,
        reloadWaitMaxSeconds: 8,

        // 是否启用随机滚动
        enableRandomScroll: true,

        // 滚动概率
        scrollChance: 0.35,

        // 滚动检测间隔（秒）
        scrollCheckMinSeconds: 60,
        scrollCheckMaxSeconds: 180,
    };

    // =====================================================
    // LOGGER
    // =====================================================

    function log(...args) {

        if (!CONFIG.debug) return;

        console.log(
            '[AutoReload]',
            ...args
        );
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
    // HUMAN-LIKE DELAY
    // =====================================================

    function getReloadDelay() {

        let minutes = rand(
            CONFIG.minMinutes,
            CONFIG.maxMinutes
        );

        // 后台标签页增加随机延迟
        if (document.hidden) {

            minutes += rand(
                0,
                CONFIG.hiddenExtraMinutes
            );
        }

        // 夜间随机长暂停
        if (CONFIG.enableNightPause) {

            const hour = new Date().getHours();

            // 凌晨 2~7 点
            if (hour >= 2 && hour <= 7) {

                // 35% 概率暂停
                if (Math.random() < 0.35) {

                    const extra = rand(15, 60);

                    log(
                        `Night pause +${extra.toFixed(1)} min`
                    );

                    minutes += extra;
                }
            }
        }

        // 随机抖动
        const jitter = randInt(
            -CONFIG.jitterSeconds,
            CONFIG.jitterSeconds
        );

        return (
            minutes * 60 + jitter
        ) * 1000;
    }

    // =====================================================
    // HUMAN SCROLL
    // =====================================================

    function humanScroll() {

        if (!CONFIG.enableRandomScroll) {
            return;
        }

        const maxScroll =
            document.body.scrollHeight - window.innerHeight;

        if (maxScroll <= 0) {
            return;
        }

        const target = randInt(0, maxScroll);

        window.scrollTo({
            top: target,
            behavior: 'smooth'
        });

        log('Scroll to', target);
    }

    // =====================================================
    // USER ACTIVITY CHECK
    // =====================================================

    function isUserTyping() {

        const active = document.activeElement;

        if (!active) {
            return false;
        }

        return (
            active.tagName === 'INPUT' ||
            active.tagName === 'TEXTAREA' ||
            active.isContentEditable
        );
    }

    // =====================================================
    // SAFETY CHECK
    // =====================================================

    function shouldReload() {

        // 网络断开
        if (!navigator.onLine) {

            log('Offline');

            return false;
        }

        // 用户正在输入
        if (isUserTyping()) {

            log('User typing');

            return false;
        }

        return true;
    }

    // =====================================================
    // RELOAD
    // =====================================================

    function reloadPage() {

        // 刷新前随机等待
        const wait = randInt(
            CONFIG.reloadWaitMinSeconds,
            CONFIG.reloadWaitMaxSeconds
        ) * 1000;

        log(`Reload after ${wait / 1000}s`);

        setTimeout(() => {

            // 避免缓存假刷新
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
    // MAIN LOOP
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

                setTimeout(scheduleReload, retry);

                return;
            }

            reloadPage();

        }, delay);
    }

    // =====================================================
    // RANDOM SCROLL LOOP
    // =====================================================

    function scheduleScroll() {

        const delay = randInt(
            CONFIG.scrollCheckMinSeconds,
            CONFIG.scrollCheckMaxSeconds
        ) * 1000;

        setTimeout(() => {

            if (
                Math.random() < CONFIG.scrollChance &&
                !document.hidden
            ) {
                humanScroll();
            }

            scheduleScroll();

        }, delay);
    }

    // =====================================================
    // START
    // =====================================================

    const startupDelay = randInt(
        CONFIG.startupMinSeconds,
        CONFIG.startupMaxSeconds
    ) * 1000;

    log(
        `Startup after ${startupDelay / 1000}s`
    );

    setTimeout(() => {

        scheduleReload();
        scheduleScroll();

    }, startupDelay);

})();
