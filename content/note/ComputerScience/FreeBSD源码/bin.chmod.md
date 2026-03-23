+++
title = "bin/cat.c"
weight= 2
date = 2026-03-26
draft = false
tags=["FreeBSD","Bin"]
series=["FreeBSD"]
series_order=2
+++
<!--more-->
```C
#ifndef lint
char copyright[] =
"@(#) Copyright (c) 1989 The Regents of the University of California.\n\
 All rights reserved.\n";
#endif /* not lint */

#ifndef lint
static char sccsid[] = "@(#)chmod.c	5.21 (Berkeley) 1/27/92";
#endif /* not lint */

#include <sys/types.h>
#include <sys/stat.h>
#include <errno.h>
#include <fts.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int retval;

void err __P((const char *, ...));
void error __P((char *));
void usage __P((void));

int
main(argc, argv)
	int argc;
	char *argv[];
{
	register FTS *fts;
	register FTSENT *p;
	// oct是累加器(octal accumulator)
	// omode是最终的文件模式(octal mode)
	register int oct, omode;
	struct stat sb;
	// mode_t 的实质是 __mode_t
	// __STD_TYPE __MODE_T_TYPE __mode_t;
	// __STD_TYPE是基础类型,实现跨硬件架构
	mode_t *set;
	int ch, fflag, rflag;
	// ep是end pointer
	char *ep, *mode;

	fflag = rflag = 0;
	while ((ch = getopt(argc, argv, "Rfrwx")) != EOF)
		switch((char)ch) {
		// -R与-f解析为选项,正常进行
		case 'R':
			rflag = 1;
			break;
		case 'f':		/* no longer documented */
			fflag = 1;
			break;
		// -r/w/x不是选项而是模式
		// 回退optind
		case 'r':		/* "-[rwx]" are valid file modes */
		case 'w':
		case 'x':
			// optind为int类型
			--optind;
			// goto从循环跳出
			goto done;
		case '?':
		default:
			usage();
		}
done:	argv += optind;
	argc -= optind;

	if (argc < 2)
		usage();

	mode = *argv;
	// 如果mode为数字,则为8进制数字路径
	if (*mode >= '0' && *mode <= '7') {
		omode = (int)strtol(mode, &ep, 8);
		if (omode < 0 || *ep)
			err("invalid file mode: %s", mode);
		oct = 1;
	} else {
	// 如果为非数字,进入符号路径
	// setmode类似于一个compiler
		if (!(set = setmode(mode)))
			err("invalid file mode: %s", mode);
		oct = 0;
	}

	retval = 0;
	// 如果R参数被选
	if (rflag) {
		// FTS_NOSTAT 不开启stat获取文件元信息(原来的权限信息)
		// FTS_PHYSICAL 物理模式访问,不进入软连接
		if ((fts = fts_open(++argv,
		    oct ? FTS_NOSTAT|FTS_PHYSICAL : FTS_PHYSICAL, 0)) == NULL)
			err("%s", strerror(errno));
		while (p = fts_read(fts))
			switch(p->fts_info) {
			// FTS_D 正在进入的目录
			case FTS_D:
			// 如果此时更改权限,若更改可读权限,可能导致无法进入子目录更改
				break;
			// FTS_DNR 无法读取的目录,遍历在这里止步
			// FTS_ERR 发生通用系统错误
			// FTS_NS 无法读取文件的stat信息
			case FTS_DNR:
			case FTS_ERR:
			case FTS_NS: 
			// switch fall-through
				err("%s: %s", p->fts_path, strerror(errno));
			
			default:
			// 此处chmod 为C的BSD库函数
			// getmode是执行权限变化的库函数
				if (chmod(p->fts_accpath, oct ? omode :
				    getmode(set, p->fts_statp->st_mode)) &&
				    !fflag)
					error(p->fts_path);
				break;
			}
		exit(retval);
	}
	// 非递归情形
	if (oct) {
		while (*++argv)
			if (chmod(*argv, omode) && !fflag)
				error(*argv);
	} else
		while (*++argv)
			if ((lstat(*argv, &sb) ||
			    chmod(*argv, getmode(set, sb.st_mode))) && !fflag)
				error(*argv);
	exit(retval);
}

// 非致命错误
void
error(name)
	char *name;
{
	(void)fprintf(stderr, "chmod: %s: %s\n", name, strerror(errno));
	retval = 1;
}

// 用户指南
void
usage()
{
	(void)fprintf(stderr, "usage: chmod [-R] mode file ...\n");
	exit(1);
}

#if __STDC__
#include <stdarg.h>
#else
#include <varargs.h>
#endif

// 严重错误
void
#if __STDC__
err(const char *fmt, ...)
#else
err(fmt, va_alist)
	char *fmt;
        va_dcl
#endif
{
	va_list ap;
#if __STDC__
	va_start(ap, fmt);
#else
	va_start(ap);
#endif
	(void)fprintf(stderr, "chmod: ");
	(void)vfprintf(stderr, fmt, ap);
	va_end(ap);
	(void)fprintf(stderr, "\n");
	exit(1);
	/* NOTREACHED */
}
```