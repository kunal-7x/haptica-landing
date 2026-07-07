import Header from "../Header";
import Footer from "../Footer";
import { DemoProvider } from "../DemoModal";

type LayoutProps = {
    hideFooter?: boolean;
    children: React.ReactNode;
};

const Layout = ({ hideFooter, children }: LayoutProps) => (
    <DemoProvider>
        <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
            <Header />
            {children}
            {hideFooter ? null : <Footer />}
        </div>
    </DemoProvider>
);

export default Layout;
