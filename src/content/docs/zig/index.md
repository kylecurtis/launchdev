---
title: Learn the Zig Language
description: Learn Zig now!
---

## Welcome!

This page will teach you the Zig programming language!

<br>

## Hello, World!

```zig
const std = @import("std");

pub fn main() void {
    std.debug.print("Hello, World!\n", .{});
}
```