// ==UserScript==
// @name        Auto Reload Random
// @description Reload pages every X to 2X minutes
// @author      githuba
// @namespace   https://github.com/githuba/userscripts_me
// @supportURL  https://github.com/githuba/userscripts_me/issues
// @version     3.6
// @downloadURL https://raw.githubusercontent.com/githuba/userscripts_me/master/AutoReload.user.js
// @include     https://*.tgfcer.com/*
// @include     http://bbs.weibufengge.com/forum.php?mod=forumdisplay*
// @include     http://bbs.weibufengge.com:88/forum.php?mod=forumdisplay*
// @include     http://bbs.weibufengge.com/forum.php?mod=guide*
// @include     http://bbs.weibufengge.com:88/forum.php?mod=guide*
// @include     https://steamcn.com/forum.php?mod=forumdisplay*
// @include     https://steamcn.com/forum.php?mod=guide*
// @include     https://keylol.com/forum.php?mod=forumdisplay*
// @include     https://keylol.com/forum.php?mod=guide*
// @include     https://na.alienwarearena.com/
// @include     https://www.steamgifts.com/*
// @include     https://www.hi-pda.com/forum/forumdisplay.php?*
// @include     https://www.hostloc.com/forum.php?mod=forumdisplay&fid=45&filter=author&orderby=dateline*
// @include     https://pt.m-team.cc/torrents.php*
// @include     https://pt.m-team.cc/adult.php*
// @include     https://hdchina.org/torrents.php*
// @include     https://karagarga.in/browse.php?*
// @run-at document-end
// ==/UserScript==

var numMinutes = 2;

/* random                                                               */
/* function rand(min, max) {                                            */
/* return Math.floor(Math.random() * (max - min + 1)) + min;            */
/* }                                                                    */
var random = Math.floor(Math.random()*1000) + 1000;

/* reload every 1 minute                                                */
/* setTimeout(function(){ location.reload(); }, 1*60*1000);             */
setTimeout(function(){ location.reload(); }, numMinutes*60*random);
