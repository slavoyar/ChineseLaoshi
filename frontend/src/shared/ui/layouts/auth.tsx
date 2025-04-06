export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='m-auto grid h-full grid-cols-1 place-content-center gap-4 px-2 sm:w-full md:w-1/2 lg:w-5/12 xl:w-1/3'>
      {children}
    </div>
  );
};
