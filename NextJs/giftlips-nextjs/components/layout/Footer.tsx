const Footer = () => {
  return (
    <footer className="border-top">
      <div className="d-flex justify-content-around container flex-wrap gap-3 py-4">
        <div className="text-muted">© 2023 GiftLips. All rights reserved.</div>
        <ul className="nav d-flex justify-content-center gap-2">
          <li>
            <a
              className="text-muted"
              href="https://www.pinterest.ph/giftlips"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-pinterest"></i>
            </a>
          </li>
          <li>
            <a
              className="text-muted"
              href="https://facebook.com/giftlips"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-facebook"></i>
            </a>
          </li>
        </ul>
        <ul className="nav d-flex justify-content-center gap-2">
          <li>
            <a className="text-muted" href="terms-of-use">
              Terms of Use
            </a>
          </li>
          <li>
            <a className="text-muted" href="privacy">
              Privacy
            </a>
          </li>
          <li>
            <a className="text-muted" href="return-refund-policy">
              Return Refund Policy
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
