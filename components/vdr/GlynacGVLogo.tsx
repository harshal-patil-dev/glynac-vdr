/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Exact User Logo from Glynac-AI-Logo.png (Monogram GV with Deep Navy & Perfect Proportions)
export function GlynacGVLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Deep Navy Rounded Squircle */}
      <rect width="1000" height="1000" rx="200" fill="#011238" />

      {/* The Circular 'G' Arc */}
      <path
        d="M 571 314
           A 214 214 0 1 0 449 659
           L 437 599
           A 152 152 0 1 1 523 354
           Z"
        fill="white"
      />

      {/* The Precision 'V' with Inward Crossbar */}
      <path
        d="M 388 440
           L 602 440
           L 565 500
           L 492 500
           L 582 656
           L 708 440
           L 792 440
           L 582 772
           Z"
        fill="white"
      />
    </svg>
  );
}
