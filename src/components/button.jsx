import PropTypes from "prop-types";

Button.propTypes = {
  children: PropTypes.node.isRequired,
  appendclass: PropTypes.string,
};

export default function Button(props) {
  return (
    <button className={"btn btn-primary " + props.appendclass} {...props}>
      <div className="flex justify-center items-center gap-1">
        {props.children}
      </div>
    </button>
  );
}
