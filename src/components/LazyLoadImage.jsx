import React from 'react';
import { PropTypes } from 'prop-types';

import LazyLoadComponent from './LazyLoadComponent.jsx';
import MyImage from './MyImage.jsx';

class LazyLoadImage extends React.Component {
	constructor(props) {
		super(props);
		this.wrappedLazyLoadImageEl = null; // 大容器
		this.lazyLoadComponentEl = null; // 内部容器

		this.state = {
			loaded: false,
			visible: false,
		};

		this.checkIntersections = this.checkIntersections.bind(this);

		this.loadingObserver = new IntersectionObserver(
			this.checkIntersections,
			{ rootMargin: 100 + 'px' }
		);
	}

	checkIntersections(entries) {
		// eslint-disable-next-line max-statements
		entries.forEach(entry => {
			if (this.state.loaded) {
				return;
			}
			// 以下都是没加载完
			if (this.state.visible) {
				if (entry.intersectionRatio === 0) {
					// 看不见了
					this.setState({ visible: false }, () => {
						if (
							this.lazyLoadComponentEl &&
							this.lazyLoadComponentEl.onInvisible
						) {
							// console.log(
							// 	'Lazy::lazyLoadComponentEl::onInvisible'
							// );
							this.lazyLoadComponentEl.onInvisible();
						}
					});
				}
			} else if (entry.intersectionRatio !== 0) {
				this.setState({ visible: true });
			}
		});
	}

	onImageLoad() {
		if (this.state.loaded) {
			return null;
		}

		return () => {
			this.props.afterLoad();

			this.setState({
				loaded: true,
			});
		};
	}

	getImg() {
		let {
			afterLoad,
			beforeLoad,
			delayMethod,
			delayTime,
			effect,
			placeholder,
			placeholderSrc,
			scrollPosition,
			threshold,
			useIntersectionObserver,
			visibleByDefault,
			wrapperClassName,
			...imgProps
		} = this.props;

		return (
			<MyImage
				onLoad={this.onImageLoad()}
				imgProps={imgProps}
				stop={!this.state.visible && !this.state.loaded}
			/>
		);
	}

	getLazyLoadImage() {
		const {
			beforeLoad,
			className,
			delayMethod,
			delayTime,
			height,
			placeholder,
			scrollPosition,
			style,
			threshold,
			useIntersectionObserver,
			visibleByDefault,
			width,
		} = this.props;

		// console.log('Lazy::getLazyLoadImage');

		return (
			<LazyLoadComponent
				beforeLoad={beforeLoad}
				className={className}
				delayMethod={delayMethod}
				delayTime={delayTime}
				height={height}
				placeholder={placeholder}
				scrollPosition={scrollPosition}
				style={style}
				threshold={threshold}
				useIntersectionObserver={useIntersectionObserver}
				visibleByDefault={visibleByDefault}
				width={width}
				ref={node => (this.lazyLoadComponentEl = node)}
			>
				{this.getImg()}
			</LazyLoadComponent>
		);
	}

	getWrappedLazyLoadImage(lazyLoadImage) {
		const {
			effect,
			height,
			placeholderSrc,
			width,
			wrapperClassName,
		} = this.props;
		const { loaded } = this.state;

		const loadedClassName = loaded ? ' lazy-load-image-loaded' : '';

		return (
			<span
				ref={node => (this.wrappedLazyLoadImageEl = node)}
				className={
					wrapperClassName +
					' lazy-load-image-background ' +
					effect +
					loadedClassName
				}
				style={{
					backgroundImage:
						loaded || !placeholderSrc
							? ''
							: `url(${placeholderSrc})`,
					backgroundSize:
						loaded || !placeholderSrc ? '' : '100% 100%',
					color: 'transparent',
					display: 'inline-block',
					height: height,
					width: width,
				}}
			>
				{lazyLoadImage}
			</span>
		);
	}

	render() {
		const { effect, placeholderSrc, visibleByDefault } = this.props;

		const lazyLoadImage = this.getLazyLoadImage();

		if ((!effect && !placeholderSrc) || visibleByDefault) {
			return lazyLoadImage;
		}

		return this.getWrappedLazyLoadImage(lazyLoadImage);
	}

	componentDidMount() {
		if (this.wrappedLazyLoadImageEl) {
			// console.log('Lazy::componentDidMount observe ');
			this.loadingObserver.observe(this.wrappedLazyLoadImageEl);
		}
	}

	componentWillUnmount() {
		if (this.wrappedLazyLoadImageEl) {
			this.loadingObserver.unobserve(this.wrappedLazyLoadImageEl);
		}
	}
}

LazyLoadImage.propTypes = {
	afterLoad: PropTypes.func,
	beforeLoad: PropTypes.func,
	delayMethod: PropTypes.string,
	delayTime: PropTypes.number,
	effect: PropTypes.string,
	placeholderSrc: PropTypes.string,
	threshold: PropTypes.number,
	useIntersectionObserver: PropTypes.bool,
	visibleByDefault: PropTypes.bool,
	wrapperClassName: PropTypes.string,
};

LazyLoadImage.defaultProps = {
	afterLoad: () => ({}),
	beforeLoad: () => ({}),
	delayMethod: 'throttle',
	delayTime: 300,
	effect: '',
	placeholderSrc: null,
	threshold: 100,
	useIntersectionObserver: true,
	visibleByDefault: false,
	wrapperClassName: '',
};

export default LazyLoadImage;
