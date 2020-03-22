import React from "react";
import { connect } from "react-redux";
import { setTheme } from "../../actions";
class CSSVariableApplicator extends React.Component {
  componentDidMount() {
    this.updateCSSVariables();
  }

  componentDidUpdate(prevProps) {
    if (this.props.variables !== prevProps.variables) {
      this.updateCSSVariables();
    }
  }
  updateCSSVariables() {
    if (this.props.variables) {
      this.props.variables.forEach((value, prop) => {
        document.documentElement.style.setProperty(prop, value);
      });
      this.props.setTheme({
        theme: {
          variables: this.props.variables
        }
      });
    }
  }
  render() {
    return <div>{this.props.children}</div>;
  }
}

const mapStateToProps = state => {
  console.log("state-css", state);
  return {
    variables:
      state.appearence.theme && state.appearence.theme.variables
        ? state.appearence.theme.variables
        : [
            {
              "--app-background":
                "url('https://images.unsplash.com/photo-1506102383123-c8ef1e872756?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60') no-repeat;"
            }
          ]
  };
};

export default connect(mapStateToProps, { setTheme })(CSSVariableApplicator);
