export class Theme {
    public themeName: string;
    public themeURL: string;

    constructor(themeName: string, themeURL: string) {
        this.themeName = themeName;
        this.themeURL = themeURL;
    }
}

export class Themes {
    public static themes = [
        new Theme("(Light) Default Theme", "https://raw.githubusercontent.com/jgthms/bulma/master/css/bulma.min.css"),
        new Theme("(Light) United", "https://jenil.github.io/bulmaswatch/united/bulmaswatch.min.css"),
        new Theme("(Light) Yeti", "https://jenil.github.io/bulmaswatch/yeti/bulmaswatch.min.css"),
        new Theme("(Dark) Cyborg", "https://jenil.github.io/bulmaswatch/cyborg/bulmaswatch.min.css"),
        new Theme("(Dark) Darkly", "https://jenil.github.io/bulmaswatch/darkly/bulmaswatch.min.css"),
        new Theme("(Dark) Superhero", "https://jenil.github.io/bulmaswatch/superhero/bulmaswatch.min.css"),
        new Theme("(Dark) Solar", "https://jenil.github.io/bulmaswatch/solar/bulmaswatch.min.css")
    ]
}