/**
 * @file [MyImage]
 * @author [mzvast]
 * @email [mzvast@gmail.com]
 * @create date 2020-08-13 15:32:31
 */
/* eslint-disable max-len,babel/new-cap,operator-linebreak,fecs-export-on-declare,space-before-function-paren */
import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';

class MyImage extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			stop: false,
			empty: false,
		};
	}

	// 打断下载 https://stackoverflow.com/questions/5278304/how-to-cancel-an-image-from-loading
	render() {
		let { src, ...imgProps } = this.props.imgProps;

		if (this.state.stop) {
			src = '';
		}

		if (this.state.empty) {
			return null;
		}

		return <img onLoad={this.props.onLoad} src={src} {...imgProps} />;
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if (nextProps.stop && !this.state.stop) {
			this.handleStop();
		} else if (this.state.empty) {
			this.handleRecover();
		}
	}
	handleStop() {
		this.setState({ stop: true }, () => {
			this.setState({ empty: true });
		});
	}

	handleRecover() {
		this.setState({ stop: false, empty: false });
	}
}
MyImage.propTypes = {
	onLoad: PropTypes.func,
	imgProps: PropTypes.object,
	stop: PropTypes.bool,
};
MyImage.displayName = 'MyImage';
export default MyImage;
