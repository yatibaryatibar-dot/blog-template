import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';
import type { PluginUtils } from 'tailwindcss/types/config';

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				border: "hsl(var(--border))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: "hsl(var(--primary))",
				"primary-foreground": "hsl(var(--primary-foreground))",
				secondary: "hsl(var(--secondary))",
				"secondary-foreground": "hsl(var(--secondary-foreground))",
				muted: "hsl(var(--muted))",
				"muted-foreground": "hsl(var(--muted-foreground))",
				accent: "hsl(var(--accent))",
				"accent-foreground": "hsl(var(--accent-foreground))",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			spacing: {
				header: "var(--header-height)",
			},
			typography: (theme: PluginUtils['theme']) => ({
				DEFAULT: {
					css: {
						a: {
							color: 'hsl(var(--primary))',
							'&:hover': {
								color: 'hsl(var(--primary) / 0.8)',
							},
						},
						'h2': {
							color: theme('colors.slate.700'),
							fontWeight: '700',
							fontSize: theme('fontSize.xl[0]'),
							letterSpacing: '-0.01em',
							marginTop: '2.5rem',
							marginBottom: '1rem',
							paddingBottom: '0.5rem',
							borderBottomWidth: '1px',
							borderBottomColor: theme('colors.slate.200'),
						},
						'h3': {
							color: theme('colors.slate.600'),
							fontWeight: '700',
							fontSize: theme('fontSize.lg[0]'),
							marginTop: '2rem',
							marginBottom: '0.75rem',
						},
						'h4': {
							color: theme('colors.gray.600'),
							fontWeight: '600',
							fontSize: theme('fontSize.base[0]'),
							marginTop: '1.5rem',
							marginBottom: '0.75rem',
						},
						'h5': {
							color: theme('colors.gray.500'),
							fontWeight: '600',
							fontSize: theme('fontSize.sm[0]'),
							textTransform: 'uppercase',
							letterSpacing: '0.05em',
							marginTop: '1rem',
							marginBottom: '0.5rem',
						},
						'h6': {
							color: theme('colors.gray.400'),
							fontWeight: '500',
							fontSize: theme('fontSize.sm[0]'),
							fontStyle: 'italic',
							marginTop: '1rem',
							marginBottom: '0.5rem',
						},
						'ul, ol': {
							marginTop: '1rem',
							marginBottom: '1rem',
						},
						'pre': {
							marginTop: '1rem',
							marginBottom: '1rem',
							backgroundColor: theme('colors.muted / 0.7'),
							borderRadius: theme('borderRadius.md'),
							boxShadow: theme('boxShadow.sm'),
							padding: theme('spacing.4'),
							overflowX: 'auto',
						},
						blockquote: {
							marginTop: '1rem',
							marginBottom: '1rem',
							borderLeftColor: 'hsl(var(--muted))',
							color: 'hsl(var(--muted-foreground))',
							paddingLeft: '1.5rem',
							fontStyle: 'italic',
						},
						hr: { borderColor: 'hsl(var(--border))' },
						code: {
							color: 'hsl(var(--foreground))',
							backgroundColor: 'hsl(var(--muted))',
							borderRadius: '0.25rem',
							paddingLeft: '0.25rem',
							paddingRight: '0.25rem',
						},
						p: {
							marginTop: '1rem',
							marginBottom: '1rem',
							color: theme('colors.gray.700'),
						},
						'li > ul, li > ol': {
							marginTop: '0',
							marginBottom: '0',
						},
					},
				},
			}),
			fontFamily: {
				sans: [...defaultTheme.fontFamily.sans],
				mono: [...defaultTheme.fontFamily.mono],
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};

export default config;
