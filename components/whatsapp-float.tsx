"use client";

import Image from "next/image";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/6285177440699?text=Hello%20Iqbal%2C%20I%20checked%20out%20your%20portfolio%20and%20would%20love%20to%20connect!"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 rounded-full hover:scale-110 transition-transform drop-shadow-lg flex items-center justify-center bg-white/50 backdrop-blur-sm p-1"
      aria-label="Contact via WhatsApp"
      title="Chat with me on WhatsApp"
    >
      <div className="relative w-[42px] h-[42px]">
        <Image src="/images/whatsapp-icon.png" alt="WhatsApp" fill className="object-contain" />
      </div>
    </a>
  );
}
