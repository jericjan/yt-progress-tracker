import { ReactComponent as ResetIcon } from "icons/reset.svg";
import { ReactComponent as TrashIcon } from "icons/trash.svg";
import {
  ButtonWithTextProps,
  ResetProps,
  TrashProps,
} from "modules/interfaces";

export function TrashButton({ onClick }: TrashProps) {
  const props = {
    color: "#e72323",
    type: "left" as const,
    offset: "181%" as const,
    text: "Delete",
    Component: TrashIcon,
    onClick: onClick,
  };

  return <ButtonWithText props={props} />;
}

export function ResetButton({ onClick }: ResetProps) {
  const props = {
    color: "#ffc93a",
    type: "right" as const,
    offset: "23%" as const,
    text: "Reset Time",
    Component: ResetIcon,
    onClick: onClick,
  };

  return <ButtonWithText props={props} />;
}

export function ButtonWithText({ props }: ButtonWithTextProps) {
  const { color, type, offset, text, Component, onClick } = props;

  const textStyle = {
    color: color,
    position: "absolute" as "absolute",
    [type]: offset,
    margin: "0px",
    "text-align": "center",
    "vertical-align": "middle",
    transform: "translate(-50%, -50%)",
    top: "50%",
    "white-space": 'nowrap'
  };

  const childProps = {
    onClick: onClick,
    className: "btn-with-text",
    stroke: color
  }

  return (
    <>
      <div className="relative">
        <p style={textStyle} className="hide weight-700">
          {text}
        </p>
        <Component {...childProps} />
      </div>
    </>
  );
}
