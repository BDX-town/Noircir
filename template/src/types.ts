export interface Wrapper {
    /**
     * url to stylesheet
     */
    style: string,
    /**
     * Eleventy-generated url of current page
     */
    page: {
        url: string,
    }
    /**
     * Eleventy-generated page content (from child template)
     */
    content: string,
}