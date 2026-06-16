import React from 'react';
import { FooterInfo } from '../types';
import { ExternalLink, Milestone, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  footer: FooterInfo;
}

export default function Footer({ footer }: FooterProps) {
  return (
    <footer id="main-footer" className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 pt-8 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        
        {/* Col 1: Introduction */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-white tracking-widest uppercase font-sans">
              BITGARAM ELEMENTARY
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-300 border border-blue-800 font-bold">
              RESEARCH SCHOOL
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed text-justify">
            {footer.intro}
          </p>
          <div className="pt-2">
            <span className="text-[11px] text-neutral-500 font-medium">
              * 본 사이트는 빛가람초등학교 IB PYP 연구학교 운영 자료 공유를 위해 제작되었습니다.
            </span>
          </div>
        </div>

        {/* Col 2: School Contact Address Info */}
        <div className="flex flex-col space-y-3 font-sans">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-l-2 border-blue-500 pl-2">
            주소 및 연락처 (Contact Us)
          </h4>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-500" />
              <span>{footer.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 shrink-0 text-blue-500" />
              <span>연락처: {footer.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 shrink-0 text-blue-500" />
              <span>이메일: {footer.email}</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Related Institution Links */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-l-2 border-blue-500 pl-2">
            관련 기관 링크 (Related Links)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {footer.links?.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 py-1 px-2 rounded bg-neutral-800 hover:bg-neutral-700/80 text-neutral-300 hover:text-white transition-colors truncate"
                title={link.name}
              >
                <ExternalLink className="w-3 h-3 text-neutral-500 shrink-0" />
                <span className="truncate">{link.name}</span>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Bar containing copyright info */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-neutral-500">
        <div>
          <p id="footer-copyright-text">{footer.copyright}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-neutral-400 cursor-pointer transition-colors">이용약관</span>
          <span className="hover:text-neutral-400 cursor-pointer transition-colors">개인정보처리방침</span>
          <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-400 font-mono text-[9px] border border-neutral-700">
            System: Safe Sandbox v1.0
          </span>
        </div>
      </div>

    </footer>
  );
}
