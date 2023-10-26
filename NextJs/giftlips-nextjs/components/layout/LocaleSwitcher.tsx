import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import { Nav, NavDropdown } from "react-bootstrap";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");

  const { locale, locales, route } = useRouter();
  const otherLocales = locales?.filter((cur) => cur !== locale);

  return (
    <Nav>
      <NavDropdown title={t("switchLocale", { locale })}>
        {otherLocales?.map((l: string) => {
          return (
            <NavDropdown.Item key={l} href={route} locale={l} as={Link}>
              {t("switchLocale", { locale: l })}
            </NavDropdown.Item>
          );
        })}
      </NavDropdown>
    </Nav>
  );
}
