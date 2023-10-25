import PropTypes from "prop-types";

Button.propTypes = {
  children: PropTypes.node.isRequired,
  appendclass: PropTypes.string,
};

export default function Button(props) {
  return (
    <button
      className={
        "bg-[#3f3c3c] text-white p-2 rounded hover:bg-[#504b4b] transition " +
        props.appendclass
      }
      {...props}
    >
      <div className="flex justify-center items-center gap-1">
        {props.children}
      </div>
    </button>
  );
}
