import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode; appearance?: string; size?: string; prototypeMotion?: boolean }): ReactNode;
export function Input(props: Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> & { label: string; value: string; prototypeMotion?: boolean }): ReactNode;
