+++
title = "bin/cat.c"
weight= 1
date = 2026-03-16
draft = false
tags=["FreeBSD","Bin"]
+++
<!--more-->
```C
#ifndef lint
char copyright[] =
"@(#) Copyright (c) 1989 The Regents of the University of California.\n\
 All rights reserved.\n";
#endif /* not lint */

#ifndef lint
static char sccsid[] = "@(#)cat.c	5.15 (Berkeley) 5/23/91";
#endif /* not lint */

#include <sys/param.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <errno.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

int bflag, eflag, nflag, sflag, tflag, vflag;
int rval;
char *filename;

// 为兼容继续使用的宏
void cook_args	__P((char **));
void cook_buf	__P((FILE *));
void raw_args	__P((char **));
void raw_cat	__P((int));
void err	__P((int, const char *, ...));

int
main(argc, argv)
   // C89标准的声明参数变量方式
	int argc;
	char **argv;
{
	extern int optind;
	int ch;
	// 状态机
	while ((ch = getopt(argc, argv, "benstuv")) != -1)
		switch (ch) {
		// -b  非空行编号
		case 'b':
			bflag = nflag = 1;	/* -b implies -n */
			break;
		// -e 显示行尾符
		case 'e':
			eflag = vflag = 1;	/* -e implies -v */
			break;
		// -n 显示行号
		case 'n':
			nflag = 1;
			break;
		// -s 压缩空行
		case 's':
			sflag = 1;
			break;
		// -t 显示制表符
		case 't':
			tflag = vflag = 1;	/* -t implies -v */
			break;
		case 'u':
			setbuf(stdout, (char *)NULL);
			break;
		// -v 显示非打印字符
		case 'v':
			vflag = 1;
			break;
		default:
		case '?':
			(void)fprintf(stderr,
			    "usage: cat [-benstuv] [-] [file ...]\n");
			exit(1);
		}
	argv += optind;
	
	// 如果有参数则进入cook模式
	if (bflag || eflag || nflag || sflag || tflag || vflag)
		cook_args(argv);
	// 如果无参数则进入raw模式
	else
		raw_args(argv);
	if (fclose(stdout))
		err(1, "stdout: %s", strerror(errno));
	exit(rval);
}

void
cook_args(argv)
	char **argv;
{
	// register 关键字推荐将字节存入寄存器而非内存
	// FILE 真实身份是 struct _to_FILE
	register FILE *fp;

	fp = stdin;
	filename = "stdin";
	// do-while 保证循环至少执行一次 stdin 
	do {
		if (*argv) {
			// Unix设计, - 表示stdin
			// strcmp 当字符串相同时 return 0
			if (!strcmp(*argv, "-"))
				fp = stdin;
			else if (!(fp = fopen(*argv, "r"))) {
				err(0, "%s: %s", *argv, strerror(errno));
				++argv;
				continue;
			}
			filename = *argv++;
		}
		cook_buf(fp);
		// stdin 的生命周期由系统管理
		if (fp != stdin)
			(void)fclose(fp);
	} while (*argv);
}

void
cook_buf(fp)
	register FILE *fp;
{
	// getc 一次只能读取一个字节,需要人为使用 prev 做为换行等的参考
	register int ch, gobble, line, prev;
	// gobble 标识是否处于压缩空行状态
	line = gobble = 0;
	// prev 的初始值为 '\n' 默认文件开始是行首
	for (prev = '\n'; (ch = getc(fp)) != EOF; prev = ch) {
		if (prev == '\n') {
			if (ch == '\n') {
				// -s 参数,压缩空行
				if (sflag) {
					// 如果 gobble 为0,即不处于压缩状态或改行不需要压缩,则执行if语句
					// 如果 gobble 为1,即已经处于压缩状态且该行需压缩
					if (!gobble && putchar(ch) == EOF)
						break;
					gobble = 1;
					continue;
				}
				if (nflag && !bflag) {
					(void)fprintf(stdout, "%6d\t", ++line);
					// 确保文件流完整
					if (ferror(stdout))
						break;
				}
			} else if (nflag) {
				(void)fprintf(stdout, "%6d\t", ++line);
				if (ferror(stdout))
					break;
			}
		}
		gobble = 0;
		if (ch == '\n') {
			if (eflag)
				// 将 putchar 和结果校验压缩到一行
				if (putchar('$') == EOF)
					break;
		} else if (ch == '\t') {
			if (tflag) {
				if (putchar('^') == EOF || putchar('I') == EOF)
					break;
				continue;
			}
		} else if (vflag) {
			if (!isascii(ch)) {
				if (putchar('M') == EOF || putchar('-') == EOF)
					break;
				// 定义在ctype.h
				ch = toascii(ch);
			}
			if (iscntrl(ch)) {
				if (putchar('^') == EOF ||
				    putchar(ch == '\177' ? '?' :
				    ch | 0100) == EOF)
					break;
				continue;
			}
		}
		if (putchar(ch) == EOF)
			break;
	}
	if (ferror(fp)) {
		err(0, "%s: %s", filename, strerror(errno));
		clearerr(fp);
	}
	if (ferror(stdout))
		err(1, "stdout: %s", strerror(errno));
}

void
raw_args(argv)
	char **argv;
{
	register int fd;

	fd = fileno(stdin);
	filename = "stdin";
	do {
		if (*argv) {
			if (!strcmp(*argv, "-"))
				fd = fileno(stdin);
			// 系统调用，不建立缓冲区
			else if ((fd = open(*argv, O_RDONLY, 0)) < 0) {
				err(0, "%s: %s", *argv, strerror(errno));
				++argv;
				continue;
			}
			filename = *argv++;
		}
		raw_cat(fd);
		if (fd != fileno(stdin))
			(void)close(fd);
	} while (*argv);
}

void
raw_cat(rfd)
	register int rfd;
{
	register int nr, nw, off, wfd;
	// nr number read 实际读到的字节数
	// nw number write 实际写出的字节数
	static int bsize;
	static char *buf;
	// buf为指向内存块的指针
	struct stat sbuf;
	// stat存放文件的元数据

	wfd = fileno(stdout);
	if (!buf) {
		// 磁盘处理最快的数据大小（对齐I/O）
		if (fstat(wfd, &sbuf))
			err(1, "%s: %s", filename, strerror(errno));
		bsize = MAX(sbuf.st_blksize, 1024);
		if (!(buf = malloc((u_int)bsize)))
			err(1, "%s", strerror(errno));
	}
	while ((nr = read(rfd, buf, bsize)) > 0)
		// 若write没有一次写完nr所有字节，则下次从偏移后的位置继续开始
		for (off = 0; off < nr; nr -= nw, off += nw)
			if ((nw = write(wfd, buf + off, nr)) < 0)
				err(1, "stdout");
	if (nr < 0)
		err(0, "%s: %s", filename, strerror(errno));
}

// 让err接受可变参数，并作了兼容适配
#if __STDC__
#include <stdarg.h>
#else
#include <varargs.h>
#endif

void
#if __STDC__
err(int ex, const char *fmt, ...)
#else
err(ex, fmt, va_alist)
	int ex;
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
	(void)fprintf(stderr, "cat: ");
	(void)vfprintf(stderr, fmt, ap);
	va_end(ap);
	(void)fprintf(stderr, "\n");
	if (ex)
		exit(1);
	rval = 1;
}
```