import Image from 'next/image';

const Header = () => (
  <header className="bg-cover bg-center" style={{ backgroundImage: 'url(https://smehealthcheck.credilinq.ai/static/images/header-bg.jpg)', height:'126px' }}>
    <div className="container mx-auto py-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex justify-center md:justify-start">
          <Image src="https://smehealthcheck.credilinq.ai/static/images/logo.svg" alt="Logo" width={145} height={100} />
        </div>
        <div className="text-center md:text-left mt-4 md:mt-0">
          <h3 className="text-3xl text-white" style={{ color: '#ffffff' }}>SME HealthCheck - Get Started</h3>
        </div>
      </div>
    </div>
  </header>
);

export default Header;