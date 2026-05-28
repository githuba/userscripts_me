// ==UserScript==
// @name         Auto Reload Random Enhanced
// @namespace    https://github.com/githuba/userscripts_me
// @version      4.1
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

    // ===== Config =====

    // 基础刷新时间（分钟）
    const MIN_MINUTES = 2;
    const MAX_MINUTES = 5;

    // 页面失焦时额外增加随机延迟
    const BACKGROUND_EXTRA_DELAY = 2;

    // 是否输出日志
    const DEBUG = true;

    // ===== Utils =====

    function log(...args) {
        if (DEBUG) {
            console.log('[AutoReload]', ...args);
        }
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    // ===== Human-like Random =====

    function getReloadDelay() {

        let minutes = randomFloat(MIN_MINUTES, MAX_MINUTES);

        // 页面不活跃时，增加随机性
        if (document.hidden) {
            minutes += randomFloat(0, BACKGROUND_EXTRA_DELAY);
        }

        // 随机抖动（±15秒）
        const jitter = randomInt(-15, 15);

        return (minutes * 60 + jitter) * 1000;
    }

    // ===== Safety =====

    function shouldReload() {

        // 网络断开不刷新
        if (!navigator.onLine) {
            log('Offline, skip reload');
            return false;
        }

        // 页面正在输入时不刷新
        const active = document.activeElement;
        if (
            active &&
            (
                active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                active.isContentEditable
            )
        ) {
            log('User typing, postpone reload');
            return false;
        }

        return true;
    }

    // ===== Main =====

    function scheduleReload() {

        const delay = getReloadDelay();

        log(`Next reload in ${(delay / 1000 / 60).toFixed(2)} minutes`);

        setTimeout(() => {

            if (!shouldReload()) {

                // 推迟30~90秒再检查
                const retry = randomInt(30, 90) * 1000;

                log(`Retry after ${retry / 1000}s`);

                setTimeout(scheduleReload, retry);

                return;
            }

            log('Reloading page...');

            // 比 reload() 更干净
            location.replace(location.href);

        }, delay);
    }

    // 启动
    scheduleReload();

})();
