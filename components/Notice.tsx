interface NoticeProps {
  text: string;
}

const Notice = ({ text }: NoticeProps) => {
  return (
    <div className="w-full text-left text-gray-500">
      <p>{text}</p>
    </div>
  );
};

export default Notice;
