const Render = ({ line }: any) => {
  const data = line.chords;

  return (
    <div className="flex">
      {data.map((item: any) => (
        <>
          <div className="min-w-8 text-sm " style={{ marginLeft: `${item.position}px` }}>
            <div className=" bg-card text-foreground font-medium inline-flex items-start p-0.5 px-1 rounded">
              <div className="w-fit text-accent">
                {item.root}
                {item?.bass ? `/${item.bass}` : ''}
              </div>
              <p className="text-xs text-accent">{item.quality !== 'major' && item.quality}</p>
            </div>
          </div>
        </>
      ))}
    </div>
  );
};
export default Render;
