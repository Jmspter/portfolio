---
title: "How Operating Systems Actually Work and What That Says About Us"
excerpt: "What I learned watching a Kernel be born: computing doesn't evolve, it just keeps stacking layers."
image: "/blog/operating-systems.webp"
category: "Software Architecture"
author:
  name: "James"
  avatar: "/about-photo.jpg"
date: "12 Dec 2025"
readTime: "20 min read"
featured: false
tags:
  - Performance
  - Backend
  - DevOps
  - Architecture
---

## Introduction

A few days ago, I was at university with a friend of mine who decided to embark on one of those adventures that make any developer oscillate between genius and insanity: **he's writing his own kernel**. That's right, a kernel, from scratch, asking the machine to talk to him in the most primitive language possible.

While he talked about process queues, memory structure and interrupt management, I could only think of one thing:

> My God, I need to write about this.

And so this post was born, split into two parts.
The first talks about *how operating systems work*, but not with that generic university explanation. Instead, I explain *why a kernel exists the way it does*, from the point of view of someone who's actually tried to build one.

The second part is a more personal, almost philosophical essay about how different operating systems relate to hardware and to our personality.

Let's go.

---

## When you turn on the computer, a historical hack happens

In the middle of the explanation, my friend drops:

> The BIOS is the first code the CPU executes. It assumes the machine is a 70s processor, 16-bit, with no memory isolation.

If you've never studied this, it sounds like a prank. But it's true.
Every computer, modern or not, Windows, Linux, Mac, server or cheap laptop, starts its life thinking it still lives in the era of the Intel 8086.

That means:

- the processor enters **Real Mode**,
- it only knows how to work with **16 bits**,
- it accesses memory with ridiculous limits,
- and there's no protection at all.

If a pointer points to the wrong place, it reads. Or writes. Or blows everything up.
It's literally the hell of bugs.

And that's why every modern operating system, without exception, performs the same choreography:

1. The CPU turns on in Real Mode.
2. The bootloader runs at that classic address: **0x7C00**.
3. The bootloader prints some message on screen using the BIOS (e.g. "Bootloader OK").
4. It clears registers, adjusts pointers, prepares tables.
5. And then it makes the jump to **Protected Mode** (or long mode, in 64-bit).

That jump, the famous `jmp` in Assembly, is the moment the system stops pretending it lives in 1970.

My friend describing it was great:

> This `jmp` makes the abrupt switch to Protected Mode… this is where the system really begins.

Meanwhile, in your head, there's probably still the idea that "computer turns on → login screen appears → done".
But between turning on and showing the screen, there's a whole transition that looks more like an arcane ritual than modern technology.

---

## Why is there a bootloader? Why does everything start at 0x7C00?

Now comes the part almost nobody tells you.

The BIOS doesn't go out "looking for Windows". It only reads **the first 512-byte sector of the disk**.
If the last two bytes are **0xAA55**, it thinks:

"Okay, this disk is bootable. I'll run this."

That's why my friend's code has exactly those bytes at the end. Not because it's pretty.
But because the BIOS only understands that.
It's like the signature of a 1981 contract that nobody dared to update.

And that sector is always loaded at **0x7C00**, the most traditional address in the history of personal computing.

If you write one wrong byte in those 512 bytes, goodbye system.
If you put the wrong signature, the BIOS ignores you.
If your bootloader has 513 bytes… it simply doesn't exist.

Building a kernel doesn't start with writing "drivers". It starts by negotiating with a ghost from forty years ago.

---

## The transition from chaos to order

And here's an interesting part of the conversation:

> This `mov` here clears the registers. This `call print` displays the message. This `jmp` here is what actually makes everything happen…

The bootloader code isn't "pretty code".
It's more or less:

- clean up the garbage,
- check the CPU isn't crazy,
- print something just so you know it's alive,
- and jump to the next stage.

It's almost a "good morning, system, let's pretend we're organized".

Only after it activates Protected Mode does the real kernel begin: paging, memory management, interrupts, drivers and multitasking, all the stuff you learn *afterwards*.

The beginning is all about survival.

---

## One curiosity that always intrigued me: what if the world hadn't chosen binary?

Remember when I said everything starts in 16-bit compatibility mode, all that old stuff?
That has even deeper roots: the choice of the binary system as the basis of computing.

A few months ago I watched a video about ternary computers. Yes, ternary. Where, instead of just 0 and 1, the digits would be **-1, 0, 1**.
And the craziest part: ternary computers actually existed.
The USSR even built one, the **Setun**, in the 60s.

You know why?

Because, mathematically, balanced ternary is more efficient than binary in several operations.
It's more "entropically stable", consumes less energy per operation and reduces the number of required logic gates.

If the industry had chosen ternary instead of binary, probably:

- bootloaders would be more compact,
- addressing would have been more natural,
- and a lot of the current design simply wouldn't exist.

But that's not what happened.
Binary was chosen because it was cheaper to implement physically.

And here we are, in 2025, still respecting rules and limitations designed for 1970s transistors.

Mess with a kernel for five minutes and you'll realize:
the past didn't die, it's just in disguise.

---

## The point I want to make

Today everyone talks about AI, cloud, containers, microservices, Kubernetes, Databricks…
But when you go back to the beginning of the system, you realize none of that exists without an extremely rigid, archaic environment full of restrictions.

The way an operating system works isn't "the best possible design".
It's the sum of all the historical decisions that **nobody dared to rewrite**.

The Linux kernel?
It still has to respect that the CPU wakes up thinking it lives in 1978.

Windows?
Same ritual. Just with more steps.

Mac?
Same dance, just with different makeup.

And my friend trying to write a kernel from scratch reminded me of this:

There is no modern operating system that doesn't go through a prehistoric phase in the first milliseconds of life.

The heart of modernity is, ironically, completely tied to the past.

---

## Territories, Dictatorships, Monarchies and Anarchies: How Each Operating System Domesticates Its Hardware

After that conversation about kernels (where my friend described his code with the same shine in his eyes as someone talking about their first child), something was bugging me. I realized it *wasn't just about kernels*. It was about **how each operating system decides to use, or control, the hardware**. Because, in the end, an OS is basically this: *a collection of political decisions about what you can or can't do with the machine you bought*.

And that's when I realized something obvious:
**the choices we make about operating systems say more about us than we'd like to admit.**

---

### Omarchy, Keyboard-First and the path of non-minimalist minimalism

I use **Omarchy**, the distro created by DHH (the guy who invented Rails and has already picked fights with half of Twitter for sport). And I use it for two very simple reasons:

1. **Because it helps me a lot at work.**
   I open the machine and everything works. If I want to configure Ruby, Elixir, Go, Rails, Bun, Docker, or whatever else, Arch usually has the package ready and Omarchy simplifies the process even more. A `pacman -S` solves problems that on other distros would require ritual incantations.

2. **Because I like the Keyboard-First philosophy.**
   And for anyone who's never come across the term: the *Keyboard-First* philosophy is basically the idea that **the keyboard should be the main interface between you and the system**, not the mouse. Meaning: fewer clicks, more commands; less distraction, more productivity; fewer windows flying around, more focus.

   It sounds silly, but it completely changes how you interact with the computer.
   It's almost a lifestyle: *the speed of your thought shouldn't have to wait for a pointer moving across the screen.*

---

## **My friend's Fedora Workstation (or the secret search for the spiritual MacBook)**

My friend, on the other hand, uses **Fedora Workstation**, the one with pure GNOME, polished, aligned and full of minimalist charm.

He swears it's because Fedora is "more modern", "more aligned with cutting-edge technologies", "more advanced", "more corporate", "more future-proof", and every week he invents a new adjective.

But I'm almost sure, and I say this with all the love in the world:

**he just wants to make his PC look as much like a MacBook as possible.**

(GNOME is *dangerously* good at that.)

And look, I'm not judging.
Quite the opposite: it makes total sense.

GNOME has that clean vibe, those smooth transitions, trackpad gestures that make you think *"dude… this computer just evolved spiritually"*.
Minimalist, elegant, opinionated: it gives you the feeling that the system finally found its purpose in life.

And honestly?
If I wanted to turn my laptop into a budget philosophical Mac, I'd probably do the same thing.

---

### My big analogy (which might be genius, or might just be a joke I took too far)

In the middle of this reflection, I made a comparison I liked so much I decided to bring it here.

#### Windows: the Benevolent Dictatorship (or not so benevolent after all)

On Windows, you live under a strong government.
It decides what's best for you:

- "This update will run NOW."
- "I'll choose this driver for you."
- "This program you never asked for is now part of your life."

It's like living in a dictatorship that says:
**"Trust me. I know what's good for you."**

And, every now and then, it really does. After all, it's the most compatible system on the planet.
But when it goes wrong… well… everyone has seen a blue screen.

#### MacOS: the Enlightened Monarchy

Here, you live in a monarchy.
Elegant. Stable. Beautiful. Structured.
You have rights… but not many.

Apple gives you a perfect kingdom, as long as you accept living their way:

- Want to customize too much? You can't.
- Want to poke where you shouldn't? You can't.
- Want to use hardware that isn't "blessed"? Good luck.

But let's be honest:
**it's all so comfortable you even forget you live under a king.**

#### Linux: a great functional anarchy

And then we get to Linux:
**a land with no owner, no kings, no dictators, where every citizen can build their own house and write their own constitution.**

Want to compile your own kernel?
Go for it.

Want a minimalist desktop that looks like a terminal with self-esteem?
There's one.

Want a distro that looks like a spaceship?
That exists too.

The good side of anarchy: **total freedom.**

The bad side of anarchy: **total freedom.**

Yes: with great power comes a great chance of breaking the system at 2am because you decided to switch window managers "just to see how it looks".

---

### And where does hardware fit in all this?

Each operating system extracts something different from the same hardware.

- **Windows** uses everything to try to balance compatibility and performance.
  It tries to be good enough for everyone, which means perfect for almost no one, but functional for millions.

- **MacOS** uses hardware like an orchestra.
  Everything is rehearsed, calibrated, designed to work in harmony.
  It's beautiful, and expensive, like every well-run monarchy.

- **Linux** lets you pilot your own ship.
  You choose the engine, the dashboard, the protocols, the fuel and the color of the interior lights.
  And if it explodes… well… maybe it's your fault.

---

### In the end…

Every operating system is an ideology.
A lifestyle.
An interpretation of what it means to use a computer.

I choose Omarchy because of speed, simplicity and philosophy.
My friend chooses Fedora because of modernity and the stylish Plasma.
Others choose Windows because work demands it.
Others choose MacOS because they want stability and sophistication.

In the end, everyone is looking for the same thing:

**a place where the computer feels more like an ally than an obstacle.**

But each path leads through a different political territory,
from dictatorships to monarchies, from anarchies to small peaceful villages of enthusiasts.

And that's okay.

(please microsoft and apple, don't sue me, it's just banter.)