import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ROOT_VIEWPORT_TYPE = 'viewport';
const ROOT_CONTAINER_TYPE = 'container';

class InfiniteList extends Component {
  componentDidMount() {
    const { root, threshold } = this.props;

    this.io = new IntersectionObserver(this.onIntersection, {
      root: root === ROOT_CONTAINER_TYPE ? this.root : null,
      rootMargin: `0px 0px ${threshold}px 0px`,
    });

    this.io.observe(this.sentinel);
  }

  componentWillUnmount() {
    this.io.disconnect();
  }

  onIntersection = entries => {
    const { isLoading, isEndReached, onReachThreshold } = this.props;

    if (isLoading || isEndReached) {
      return;
    }

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        onReachThreshold(entry);
      }
    });
  };

  render() {
    const {
      children,
      containerClassName,
      sentinelClassName,
      containerTagName,
      sentinelTagName,
    } = this.props;
    const ContainerTagName = containerTagName;
    const SentinelTagName = sentinelTagName;

    return (
      <ContainerTagName
        ref={element => {
          this.root = element;
        }}
        className={containerClassName}
      >
        {children}
        <SentinelTagName
          ref={element => {
            this.sentinel = element;
          }}
          className={sentinelClassName}
        />
      </ContainerTagName>
    );
  }
}

InfiniteList.propTypes = {
  root: PropTypes.oneOf([ROOT_VIEWPORT_TYPE, ROOT_CONTAINER_TYPE]).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isEndReached: PropTypes.bool.isRequired,
  onReachThreshold: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  containerClassName: PropTypes.string,
  sentinelClassName: PropTypes.string,
  containerTagName: PropTypes.string,
  sentinelTagName: PropTypes.string,
  threshold: PropTypes.number,
};

InfiniteList.defaultProps = {
  containerClassName: '-risl-container',
  sentinelClassName: '-risl-sentinel',
  containerTagName: 'div',
  sentinelTagName: 'div',
  threshold: 0,
};

export default InfiniteList;
