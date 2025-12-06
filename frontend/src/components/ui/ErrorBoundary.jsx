import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props){
    super(props);
    this.state = { hasError:false, error:null };
  }
  static getDerivedStateFromError(error){ return { hasError:true, error }; }
  componentDidCatch(error, info){ if(process.env.NODE_ENV !== 'production'){ console.error('[ErrorBoundary]', error, info); } }
  render(){
    if(this.state.hasError){
      return (
        <div className="p-6 m-4 border border-red-200 bg-red-50 rounded">
          <h2 className="text-red-700 font-semibold mb-2">An Error Occurred</h2>
          <p className="text-xs text-red-600 break-all">{String(this.state.error)}</p>
          {this.props.fallbackExtra}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;