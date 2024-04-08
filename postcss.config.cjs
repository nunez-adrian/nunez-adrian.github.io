module.exports = {
    plugins: {
        'postcss-import': {},
        'tailwindcss/nesting': 'postcss-nesting',
        tailwindcss: {
            config: path.join(__dirname, 'tailwind.config.js'),
        },
        autoprefixer: {},
    }
}