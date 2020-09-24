import React from "react";
import Router from "next/router";
import PropTypes from "prop-types";



function useAuth(BaseComponent) {

    class App extends React.Component {
        static propTypes = {
            user: PropTypes.object,
        }
        static defaultProps = {
            user: null,
        }

        static async getInitialProps(ctx) {
            const user = ctx.req ? ctx.req.user && ctx.req.user.toObject() : null;
            const props = { user };

            if (BaseComponent.getInitialProps) {
                Object.assign(props, (await BaseComponent.getInitialProps(ctx)) || {})
            }

            return props;
        }

        componentDidMount() {
            let { user } = this.props;

            if (!user) Router.push('/login');
        }

        render() {
            if (!this.props.user) return null;

            return (
                <>
                    <BaseComponent {...this.props} />
                </>
            );
        }
    }
    return App;
}


export default useAuth;
