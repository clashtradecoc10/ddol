declare module "mega-link-checker" {
  function megaLinkChecker(link: string): Promise<boolean>;
  export default megaLinkChecker;
}
