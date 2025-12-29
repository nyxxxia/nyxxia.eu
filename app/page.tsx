"use client";

import { useEffect, useRef, useState } from "react";

type BootLine = {
  text: string;
  delay?: number;
  tone?: "info" | "warn" | "error";
};

const BOOT_SEQUENCE: BootLine[] = [
  {
    text: "[    0.000000] Booting Linux on physical CPU 0x0000000000 [0x410fd040]",
  },
  {
    text: "[    0.000000] Linux version 6.6.14-arch1 (builduser@archlinux) (gcc (GCC) 13.2.1 20230801) #1 SMP PREEMPT_DYNAMIC Fri Feb 2 14:22:22 UTC 2024",
  },
  {
    text: "[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-linux root=/dev/mapper/cryptroot rw quiet splash",
  },
  { text: "[    0.041238] KASLR disabled due to lack of seed" },
  {
    text: "[    0.124001] DMI: QEMU Standard PC (Q35 + ICH9, 2009)/Standard PC (Q35 + ICH9, 2009), BIOS 1.16.2-1 04/01/2014",
  },
  {
    text: "[    0.441230] ACPI: Early table checksum verification disabled",
  },
  {
    text: "[    0.752993] CPU: 12th Gen Intel(R) Core(TM) i7-12800H (family: 0x6, model: 0x9a, stepping: 0x3)",
  },
  { text: "[    1.230001] smp: Bringing up secondary CPUs ..." },
  { text: "[    1.540323] smp: Brought up 1 node, 12 CPUs" },
  { text: "[    2.011234] ACPI: bus type PCI registered" },
  {
    text: "[    2.513580] clocksource: tsc: mask: 0xffffffffffffffff max_cycles: 0x3991fef7bf, max_idle_ns: 440795247666 ns",
  },
  {
    text: "[    3.119320] PCI: Using configuration type 1 for base access",
  },
  { text: "[    3.458441] iommu: Default domain type: Translated" },
  {
    text: "[    3.870003] ata2: SATA link up 6.0 Gbps (SStatus 133 SControl 300)",
  },
  {
    text: "[    3.991943] usb 1-1: new high-speed USB device number 2 using xhci_hcd",
  },
  { text: "[    4.241900] random: crng init done" },
  { text: "[    4.651930] NET: Registered PF_INET6 protocol family" },
  { text: "[    4.990115] Segment Routing with IPv6" },
  {
    text: "[    5.320833] device-mapper: table: 254:0: crypt: Device lookup failed",
    tone: "warn",
  },
  {
    text: "[    6.110448] usbcore: registered new interface driver usbhid",
  },
  {
    text: "[    6.580332] input: AT Translated Set 2 keyboard as /devices/platform/i8042/serio0/input/input3",
  },
  {
    text: "[    7.442301] systemd[1]: systemd 254.6-1-arch booting with kernel 6.6.14-arch1.",
  },
  { text: "[    7.442565] systemd[1]: Detected architecture x86-64." },
  { text: "[    7.443112] systemd[1]: Hostname set to <nyxxia>." },
  { text: "[    7.843999] systemd[1]: Created slice Slice /system/getty." },
  { text: "[    8.190993] systemd[1]: Reached target Local File Systems (Pre)." },
  { text: "[    8.744991] systemd[1]: Reached target Paths." },
  { text: "[    9.140441] systemd[1]: Reached target Sockets." },
  { text: "[    9.743823] systemd[1]: Starting Journal Service..." },
  {
    text: "[   10.201929] systemd-journald[223]: Received client request to flush runtime journal.",
  },
  {
    text: "[   12.119129] systemd[1]: Starting Cryptography Setup for cryptroot...",
    tone: "warn",
  },
  {
    text: "[   12.898331] systemd-cryptsetup[382]: Failed to activate with keyfile /crypto_keyfile.bin.",
    tone: "warn",
  },
  {
    text: "[   12.898472] systemd-cryptsetup[382]: Timed out waiting for device /dev/nvme0n1p2.",
    tone: "warn",
  },
  {
    text: "[   13.429543] systemd[1]: A start job is running for /dev/mapper/cryptroot (1min 30s / no limit)",
    delay: 1400,
    tone: "warn",
  },
  { text: "[   15.035009] random: fast init done" },
  {
    text: "[   20.950392] systemd[1]: Timed out waiting for device dev-mapper-cryptroot.device.",
    delay: 700,
    tone: "error",
  },
  {
    text: "[   20.950557] systemd[1]: Dependency failed for /sysroot.",
    tone: "error",
  },
  {
    text: "[   20.950719] systemd[1]: Dependency failed for Initrd Root File System.",
    tone: "error",
  },
  {
    text: "[   20.950901] systemd[1]: Dependency failed for Reload Configuration from the Real Root.",
    tone: "error",
  },
  {
    text: "[   20.951078] systemd[1]: Triggering OnFailure= dependencies of cryptsetup.target.",
    tone: "warn",
  },
  {
    text: "[   21.160324] systemd[1]: Entering emergency mode. (UID 0)",
    delay: 800,
    tone: "error",
  },
  {
    text: "[   21.160451] systemd[1]: systemd-journald.service: Deactivated successfully.",
  },
  {
    text: 'Welcome to emergency mode! After logging in, type "journalctl -xb" to view system logs, "systemctl reboot" to reboot, "systemctl default" or ^D to boot into default mode.',
    delay: 1200,
    tone: "error",
  },
  {
    text: "Press Enter for maintenance",
    delay: 600,
    tone: "warn",
  },
  {
    text: "(or press Control-D to continue):",
    delay: 800,
    tone: "warn",
  },
  { text: "root@nyxxia:~#", tone: "info", delay: 0 },
];

const MAX_VISIBLE_LINES = 30;
const randomJitter = () => Math.random() * 80;

export default function Home() {
  const [lines, setLines] = useState<BootLine[]>([]);
  const [maxLines, setMaxLines] = useState<number>(MAX_VISIBLE_LINES);
  const timers = useRef<number[]>([]);
  const started = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const computeDelay = (line: BootLine) => {
    if (line.delay !== undefined) return line.delay;
    const base = Math.min(520, Math.max(40, line.text.length * 3.4));
    return base + randomJitter();
  };

  const measureMaxLines = () => {
    const container = containerRef.current;
    if (!container) return MAX_VISIBLE_LINES;
    const rootStyles = getComputedStyle(document.documentElement);
    const lineHeight =
      parseFloat(rootStyles.getPropertyValue("--boot-line-height")) || 21;
    const available = container.clientHeight || window.innerHeight;
    const allowed = Math.max(10, Math.floor(available / lineHeight) - 1);
    return Math.min(MAX_VISIBLE_LINES, allowed);
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cancelled = false;

    const queueNext = (index: number) => {
      if (cancelled) return;
      const entry = BOOT_SEQUENCE[index];
      setLines((prev) => {
        const next = [...prev, entry];
        if (next.length > maxLines) {
          return next.slice(next.length - maxLines);
        }
        return next;
      });

      const nextIndex = index + 1;
      if (nextIndex >= BOOT_SEQUENCE.length) return;

      const timer = window.setTimeout(
        () => queueNext(nextIndex),
        computeDelay(entry)
      );
      timers.current.push(timer);
    };

    const firstTimer = window.setTimeout(() => queueNext(0), 160);
    timers.current.push(firstTimer);

    return () => {
      cancelled = true;
      timers.current.forEach((id) => clearTimeout(id));
      timers.current = [];
    };
  }, [maxLines]);

  useEffect(() => {
    const updateMax = () => setMaxLines(measureMaxLines());
    updateMax();
    window.addEventListener("resize", updateMax);
    return () => window.removeEventListener("resize", updateMax);
  }, []);

  useEffect(() => {
    setLines((prev) => {
      if (prev.length <= maxLines) return prev;
      return prev.slice(prev.length - maxLines);
    });
  }, [maxLines]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (container.scrollHeight <= container.clientHeight) return;
    setLines((prev) => (prev.length ? prev.slice(1) : prev));
  }, [lines]);

  return (
    <main className="boot-screen">
      <div className="boot-container" ref={containerRef}>
        {lines.map((line, index) => (
          <div
            key={`${line.text}-${index}`}
            className={`boot-line${line.tone ? ` boot-line--${line.tone}` : ""}`}
          >
            {line.text}
          </div>
        ))}
        <div className="boot-cursor" aria-hidden>
          █
        </div>
      </div>
    </main>
  );
}
