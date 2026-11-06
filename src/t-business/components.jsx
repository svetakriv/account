import React, { useId, useState, useLayoutEffect, useRef } from 'react';
import catalog from './catalog.json';
import { buttonStates, inputStates } from './model.mjs';
import { createFloatingLabelMotion } from './motion.mjs';

const h = React.createElement;

// Label-only Button: explicit Figma property overrides show-icon=false,
// show-label=true, show-right-icon=false. No icon or loader is fabricated.
export function Button({ children, appearance = 'primary', size = 'large',
  family = 'button-desktop', disabled = false, type = 'button', className = '', prototypeMotion = true,
  onPointerEnter, onPointerLeave, onPointerDown, onPointerUp, onPointerCancel,
  onKeyDown, onKeyUp, onBlur, ...props }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const states = buttonStates(catalog, { family, appearance, size });
  const state = disabled ? 'disabled' : pressed ? 'pressed' : hover ? 'hover' : 'normal';
  const item = states[state];
  return h('button', { ...props, type, disabled,
    className: `tb-button ${className}`, style: { ...item.style, ...props.style },
    'data-figma-node': item.id,
    'data-prototype-motion': String(prototypeMotion),
    onPointerEnter: e => { if (e.pointerType !== 'touch') setHover(true); onPointerEnter?.(e); },
    onPointerLeave: e => { setHover(false); setPressed(false); onPointerLeave?.(e); },
    onPointerDown: e => { if (e.button === 0) setPressed(true); onPointerDown?.(e); },
    onPointerUp: e => { setPressed(false); onPointerUp?.(e); },
    onPointerCancel: e => { setPressed(false); onPointerCancel?.(e); },
    onKeyDown: e => { if (e.key === ' ' || e.key === 'Enter') setPressed(true); onKeyDown?.(e); },
    onKeyUp: e => { setPressed(false); onKeyUp?.(e); },
    onBlur: e => { setPressed(false); onBlur?.(e); },
  }, h('span', { className: 'tb-button-label-box', style: item.labelBoxStyle },
    h('span', { style: item.labelStyle }, children)));
}

// Confirmed interactive subset: desktop / large / label on / skeleton off.
// Native input semantics are implemented here; unexported validation/disabled/
// read-only appearances are deliberately not exposed as template options.
export function Input({ label, value, onChange, placeholder = '', id: suppliedId,
  className = '', onFocus, onBlur, disabled, readOnly, prototypeMotion = true, ...props }) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const [focused, setFocused] = useState(false);
  const labelRef = useRef(null);
  const inputRef = useRef(null);
  const motionRef = useRef(null);
  // Invalid appearance supplied by FormField from dfRHWv9jKbvRbRKPjReJTR,
  // nodes 11460:1584 / 11460:1656. Original catalog remains unchanged.
  // Native disabled is used for completed SMS entry; retain the confirmed normal
  // appearance rather than fabricate an unexported Figma disabled palette.
  if (readOnly) throw new Error('This Input template has no exported read-only appearance.');
  if (!label) throw new Error('This Input template requires a visible label.');
  if (typeof value !== 'string' || typeof onChange !== 'function') throw new Error('Input requires controlled string value and onChange.');
  const states = inputStates(catalog);
  const item = states[`${focused && !disabled ? 'focus' : 'normal'}/${value ? 'on' : 'off'}`];
  const text = item.texts.value || item.texts.placeholder || item.texts.label;
  const labelText = item.texts.label;
  useLayoutEffect(() => {
    if (!motionRef.current) motionRef.current = createFloatingLabelMotion(labelRef.current);
    motionRef.current.update(labelText, prototypeMotion);
  }, [labelText, prototypeMotion]);
  useLayoutEffect(() => () => {
    motionRef.current?.destroy();
    motionRef.current = null;
  }, []);
  const inputStyle = { ...text.style, left: text.left, top: text.top,
    // Match the captured content box, including its empty end accessory slot.
    right: item.contentRight, height: text.height,
    '--tb-placeholder-color': item.texts.placeholder?.style.color || text.style.color };
  return h('div', { className: `tb-field ${className}`,
    style: { width: item.width, height: item.height, ...item.style }, 'data-figma-node': item.id,
    'data-prototype-motion': String(prototypeMotion), onClick: () => inputRef.current?.focus() },
    h('label', { ref: labelRef, htmlFor: id, className: 'tb-field-label', style: {
      ...labelText.style, left: labelText.left, top: labelText.top, right: item.contentRight, height: labelText.height,
    } }, label),
    h('input', { ...props, disabled, ref: inputRef, id, value, onChange, className: 'tb-field-control', style: inputStyle,
      placeholder: focused ? placeholder : '',
      onFocus: e => { setFocused(true); onFocus?.(e); },
      onBlur: e => { setFocused(false); onBlur?.(e); },
    }));
}
